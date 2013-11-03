function Controller() {
    function saveBoatbutton(boatproperties) {
        boatproperties.reverse();
        var row = Ti.UI.createTableViewRow({
            height: "100px"
        });
        var image = Ti.UI.createImageView({
            url: "KS_nav_ui.png"
        });
        var viewBT = Ti.UI.createButton({
            left: "50%",
            width: "25%",
            title: "View this boat.",
            height: "80%"
        });
        var boatLabel = Ti.UI.createLabel({
            text: boatproperties.pop(),
            loa: boatproperties.pop(),
            lwl: boatproperties.pop(),
            beam: boatproperties.pop(),
            displacement: boatproperties.pop(),
            sailArea: boatproperties.pop(),
            left: 10,
            color: "#000"
        });
        row.add(boatLabel);
        row.add(image);
        row.add(viewBT);
        $.boatTable.appendRow(row);
        viewBT.addEventListener("click", function() {
            calcBoat(boatLabel.text, boatLabel.loa, boatLabel.lwl, boatLabel.beam, boatLabel.displacement, boatLabel.sailArea);
            textFields[0].value = boatLabel.text;
            textFields[1].value = boatLabel.loa;
            textFields[2].value = boatLabel.lwl;
            textFields[3].value = boatLabel.beam;
            textFields[4].value = boatLabel.displacement;
            textFields[5].value = boatLabel.sailArea;
            $.tabgroup.setActiveTab(2);
        });
    }
    function calcBoat(boatName, loa, lwl, beam, displacement, sailArea) {
        $.selectedBoat.text = boatName + " is currently selected!";
        $.maxHullSpeed.text = "Max Hull Speed: " + Math.round(134 * Math.sqrt(+lwl)) / 100;
        $.dL.text = "D/L: " + Math.round(100 * (+displacement / 2240 / Math.pow(.01 * +lwl, 3))) / 100;
        $.sAD.text = "SA/D: " + Math.round(100 * (+sailArea / Math.pow(+displacement / 64, .67))) / 100;
        $.capI.text = "Capsize Index: " + Math.round(100 * (+beam / Math.pow(+displacement / 64, .33))) / 100;
        $.comfI.text = "Comfort Index: " + Math.round(100 * (+displacement / (.65 * (.7 * +lwl + .3 * +loa) * Math.pow(+beam, 1.33)))) / 100;
    }
    function getBoatsFromDB() {
        var foundboats = [];
        if (0 != "android".toString().toLowerCase().localeCompare("mobileweb")) {
            var boatsdb = Ti.Database.open("boatsDB");
            var boats = boatsdb.execute("SELECT * FROM theBoats");
            while (boats.isValidRow()) {
                var values = [];
                values.push(boats.fieldByName("boatName"));
                values.push(boats.fieldByName("loa"));
                values.push(boats.fieldByName("lwl"));
                values.push(boats.fieldByName("beam"));
                values.push(boats.fieldByName("displacement"));
                values.push(boats.fieldByName("sailArea"));
                foundboats.push(values);
                boats.next();
            }
            boatsdb.close();
        }
        return foundboats;
    }
    function makeBoatButtonsFromDB() {
        function makeTheBoatButton(element) {
            saveBoatbutton(element);
        }
        var boats = getBoatsFromDB();
        boats.forEach(makeTheBoatButton);
        return boats;
    }
    function addBoatToDB() {
        if (0 != "android".toString().toLowerCase().localeCompare("mobileweb")) {
            var boatsdb = Ti.Database.open("boatsDB");
            boatsdb.execute("INSERT INTO theBoats (boatName,loa,lwl,beam,displacement,sailArea) VALUES (?,?,?,?,?,?)", $.boatName.value, $.loa.value, $.lwl.value, $.beam.value, $.displacement.value, $.sailArea.value);
            boatsdb.close();
        }
    }
    function validateData() {
        function validateField(element, index) {
            if (0 == element.value.localeCompare("")) {
                valid = false;
                element.setValue("");
                alertText += "Please enter something in the " + element.hintText + " box.\n";
            } else if (0 != index) if (isNaN(element.value)) {
                valid = false;
                element.setValue("");
                alertText += "Please enter a number in the" + element.hintText + " box.\n";
            } else if (0 == parseFloat(element.value)) {
                valid = false;
                element.setValue("");
                alertText += "The" + element.hintText + "cannot be 0.\n";
            }
        }
        var valid = true;
        var alertText = "";
        textFields.forEach(validateField);
        valid || alert(alertText);
        return valid;
    }
    function swiped(element, index) {
        element.addEventListener("swipe", function(e) {
            "left" == e.direction ? $.tabgroup.setActiveTab(index + 1) : "right" == e.direction && $.tabgroup.setActiveTab(index - 1);
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.tabgroup = Ti.UI.createTabGroup({
        tabHeight: 0,
        navBarHidden: true,
        id: "tabgroup"
    });
    $.__views.addboat = Ti.UI.createWindow({
        backgroundColor: "#fff",
        bubbleParent: true,
        tabBarHidden: true,
        title: "Enter your new boats!",
        id: "addboat"
    });
    $.__views.tab1scroll = Ti.UI.createScrollView({
        top: 0,
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "87%",
        width: "100%",
        layout: "vertical",
        id: "tab1scroll"
    });
    $.__views.addboat.add($.__views.tab1scroll);
    $.__views.boatName = Ti.UI.createTextField({
        clearOnEdit: false,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "boatName",
        hintText: "Boat Name"
    });
    $.__views.tab1scroll.add($.__views.boatName);
    $.__views.loa = Ti.UI.createTextField({
        clearOnEdit: true,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "loa",
        hintText: "LOA"
    });
    $.__views.tab1scroll.add($.__views.loa);
    $.__views.lwl = Ti.UI.createTextField({
        clearOnEdit: true,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "lwl",
        hintText: "LWL"
    });
    $.__views.tab1scroll.add($.__views.lwl);
    $.__views.beam = Ti.UI.createTextField({
        clearOnEdit: true,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "beam",
        hintText: "Beam"
    });
    $.__views.tab1scroll.add($.__views.beam);
    $.__views.displacement = Ti.UI.createTextField({
        clearOnEdit: true,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "displacement",
        hintText: "Displacement"
    });
    $.__views.tab1scroll.add($.__views.displacement);
    $.__views.sailArea = Ti.UI.createTextField({
        clearOnEdit: true,
        editable: true,
        width: "100%",
        height: "14%",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderColor: "Black",
        font: {
            fontSize: "25%",
            fontFamily: "Helvetica Neue"
        },
        bubbleParent: true,
        id: "sailArea",
        hintText: "Sail Area"
    });
    $.__views.tab1scroll.add($.__views.sailArea);
    $.__views.__alloyId0 = Ti.UI.createView({
        layout: "horizontal",
        width: "100%",
        height: "13%",
        bottom: "0",
        bubbleParent: true,
        id: "__alloyId0"
    });
    $.__views.addboat.add($.__views.__alloyId0);
    $.__views.save = Ti.UI.createButton({
        bubbleParent: true,
        width: "33%",
        height: "100%",
        title: "Save New Boat",
        id: "save"
    });
    $.__views.__alloyId0.add($.__views.save);
    $.__views.cancel = Ti.UI.createButton({
        bubbleParent: true,
        width: "33%",
        height: "100%",
        title: "Cancel",
        id: "cancel"
    });
    $.__views.__alloyId0.add($.__views.cancel);
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.addboat,
        title: "Add a new Boat",
        id: "tab1",
        icon: "KS_nav_ui.png"
    });
    $.__views.tabgroup.addTab($.__views.tab1);
    $.__views.dbwindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        bubbleParent: true,
        tabBarHidden: true,
        title: "Here is a list of your saved boats!",
        id: "dbwindow"
    });
    $.__views.boatTable = Ti.UI.createTableView({
        rowHeight: "100px",
        minRowHeight: "50px",
        maxRowHeight: "10%",
        id: "boatTable"
    });
    $.__views.dbwindow.add($.__views.boatTable);
    $.__views.__alloyId1 = Ti.UI.createView({
        layout: "horizontal",
        width: "100%",
        height: "13%",
        bottom: "0",
        bubbleParent: true,
        id: "__alloyId1"
    });
    $.__views.dbwindow.add($.__views.__alloyId1);
    $.__views.add = Ti.UI.createButton({
        bubbleParent: true,
        width: "33%",
        height: "100%",
        image: "Button-Add-icon.png",
        title: "Add a New Boat",
        id: "add"
    });
    $.__views.__alloyId1.add($.__views.add);
    $.__views.exit = Ti.UI.createButton({
        bubbleParent: true,
        width: "33%",
        height: "100%",
        title: "Exit",
        id: "exit"
    });
    $.__views.__alloyId1.add($.__views.exit);
    $.__views.tab2 = Ti.UI.createTab({
        window: $.__views.dbwindow,
        title: "View Saved Boats",
        id: "tab2",
        icon: "brownboat.png"
    });
    $.__views.tabgroup.addTab($.__views.tab2);
    $.__views.savedboats = Ti.UI.createWindow({
        backgroundColor: "#fff",
        bubbleParent: true,
        tabBarHidden: true,
        title: "Currently Selected Boat Stats!",
        id: "savedboats"
    });
    $.__views.tab3scroll = Ti.UI.createScrollView({
        top: 0,
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "87%",
        width: "100%",
        layout: "vertical",
        id: "tab3scroll"
    });
    $.__views.savedboats.add($.__views.tab3scroll);
    $.__views.selectedBoat = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "selectedBoat",
        text: "You must select a boat!"
    });
    $.__views.tab3scroll.add($.__views.selectedBoat);
    $.__views.maxHullSpeed = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "maxHullSpeed",
        text: "Max Hull Speed"
    });
    $.__views.tab3scroll.add($.__views.maxHullSpeed);
    $.__views.dL = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "dL",
        text: "D/L"
    });
    $.__views.tab3scroll.add($.__views.dL);
    $.__views.sAD = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "sAD",
        text: "SA/D"
    });
    $.__views.tab3scroll.add($.__views.sAD);
    $.__views.capI = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "capI",
        text: "Capsize Index"
    });
    $.__views.tab3scroll.add($.__views.capI);
    $.__views.comfI = Ti.UI.createLabel({
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        id: "comfI",
        text: "Comfort Index"
    });
    $.__views.tab3scroll.add($.__views.comfI);
    $.__views.__alloyId2 = Ti.UI.createView({
        layout: "horizontal",
        width: "100%",
        height: "13%",
        bottom: "0",
        bubbleParent: true,
        id: "__alloyId2"
    });
    $.__views.savedboats.add($.__views.__alloyId2);
    $.__views.home = Ti.UI.createButton({
        bubbleParent: true,
        width: "33%",
        height: "100%",
        title: "Back other boats.",
        id: "home"
    });
    $.__views.__alloyId2.add($.__views.home);
    $.__views.tab3 = Ti.UI.createTab({
        window: $.__views.savedboats,
        title: "View Selected Boat",
        id: "tab3",
        icon: "KS_nav_ui.png"
    });
    $.__views.tabgroup.addTab($.__views.tab3);
    $.__views.tabgroup && $.addTopLevelView($.__views.tabgroup);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.tabgroup.open();
    var textFields = [ $.boatName, $.loa, $.lwl, $.beam, $.displacement, $.sailArea ];
    var windows = [ $.addboat, $.dbwindow, $.savedboats ];
    makeBoatButtonsFromDB();
    windows.forEach(swiped);
    $.save.addEventListener("click", function() {
        function getvalues(element) {
            test.push(element.value);
        }
        if (validateData()) {
            addBoatToDB();
            var test = [];
            textFields.forEach(getvalues);
            saveBoatbutton(test);
            $.tabgroup.setActiveTab(1);
        }
    });
    $.cancel.addEventListener("click", function() {
        $.tabgroup.setActiveTab(1);
    });
    $.add.addEventListener("click", function() {
        textFields.forEach(function(element) {
            element.value = "";
        });
        $.tabgroup.setActiveTab(0);
    });
    $.exit.addEventListener("click", function() {
        0 == "android".toString().toLowerCase().localeCompare("android") ? Ti.Android.currentActivity.finish() : alert("You Hit Exit");
    });
    $.home.addEventListener("click", function() {
        $.tabgroup.setActiveTab(1);
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;