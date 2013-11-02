function Controller() {
    function saveBoatbutton(boatproperties) {
        boatproperties.reverse();
        var aButton = Ti.UI.createLabel({
            window: $.tab2scroll,
            text: boatproperties.pop(),
            height: "13%",
            width: "100%",
            font: {
                fontSize: "50%",
                fontFamily: "Helvetica Neue"
            },
            loa: boatproperties.pop(),
            lwl: boatproperties.pop(),
            beam: boatproperties.pop(),
            displacement: boatproperties.pop(),
            sailArea: boatproperties.pop()
        });
        aButton.addEventListener("click", function() {
            calcBoat(aButton.text, aButton.loa, aButton.lwl, aButton.beam, aButton.displacement, aButton.sailArea);
            textFields[0].value = aButton.text;
            textFields[1].value = aButton.loa;
            textFields[2].value = aButton.lwl;
            textFields[3].value = aButton.beam;
            textFields[4].value = aButton.displacement;
            textFields[5].value = aButton.sailArea;
            $.tabgroup.setActiveTab(2);
        });
        $.tab2scroll.add(aButton);
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
    function updateBoatInDB(values) {
        if (0 != "android".toString().toLowerCase().localeCompare("mobileweb")) {
            var boatsdb = Ti.Database.open("boatsDB");
            boatsdb.execute("UPDATE theBoats SET boatName=?,loa=?,lwl=?,beam=?,displacement=?,sailArea=? WHERE boatName=? ", values[0], values[1], values[2], values[3], values[4], values[5], values[0]);
            boatsdb.close();
            alert(values[0] + " has been updated.");
        }
    }
    function deleteBoatInDB(boatName) {
        if (0 != "android".toString().toLowerCase().localeCompare("mobileweb")) {
            var boatsdb = Ti.Database.open("boatsDB");
            boatsdb.execute("DELETE FROM theBoats WHERE boatName=?", boatName);
            boatsdb.close();
            updateBoatViewer();
            alert(boatName + " deleted!");
        }
    }
    function updateBoatViewer() {
        $.tab2scroll.removeAllChildren();
        makeBoatButtonsFromDB();
    }
    function validateData() {
        function validateField(element, index) {
            if (0 == element.value.localeCompare("")) {
                valid = false;
                element.setValue("");
                alert("Please enter something in the " + element.hintText + " box.");
            } else if (0 != index) if (isNaN(element.value)) {
                valid = false;
                element.setValue("");
                alert("Please enter a number in the" + element.hintText + " box.");
            } else if (0 == parseFloat(element.value)) {
                valid = false;
                element.setValue("");
                alert("The" + element.hintText + "cannot be 0.");
            }
        }
        var valid = true;
        textFields.forEach(validateField);
        return valid;
    }
    function back(element, index) {
        element.addEventListener("click", function() {
            $.tabgroup.setActiveTab(index);
        });
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
        id: "tabgroup"
    });
    $.__views.addboat = Ti.UI.createWindow({
        backgroundColor: "#fff",
        bubbleParent: true,
        title: "Enter your new boats!",
        id: "addboat"
    });
    $.__views.tab1scroll = Ti.UI.createScrollView({
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "100%",
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
        width: "25%",
        height: "100%",
        title: "Save",
        id: "save"
    });
    $.__views.__alloyId0.add($.__views.save);
    $.__views.edit = Ti.UI.createButton({
        bubbleParent: true,
        width: "25%",
        height: "100%",
        title: "Edit",
        id: "edit"
    });
    $.__views.__alloyId0.add($.__views.edit);
    $.__views.deleteBT = Ti.UI.createButton({
        bubbleParent: true,
        width: "25%",
        height: "100%",
        title: "Delete",
        id: "deleteBT"
    });
    $.__views.__alloyId0.add($.__views.deleteBT);
    $.__views.exit = Ti.UI.createButton({
        bubbleParent: true,
        width: "25%",
        height: "100%",
        title: "Exit",
        id: "exit"
    });
    $.__views.__alloyId0.add($.__views.exit);
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.addboat,
        title: "New Boat",
        id: "tab1",
        icon: "KS_nav_ui.png"
    });
    $.__views.tabgroup.addTab($.__views.tab1);
    $.__views.dbwindow = Ti.UI.createWindow({
        backgroundColor: "#fff",
        bubbleParent: true,
        title: "Here is a list of your saved boats!",
        id: "dbwindow"
    });
    $.__views.tab2scroll = Ti.UI.createScrollView({
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "100%",
        width: "100%",
        layout: "vertical",
        id: "tab2scroll"
    });
    $.__views.dbwindow.add($.__views.tab2scroll);
    $.__views.__alloyId1 = Ti.UI.createView({
        layout: "horizontal",
        width: "100%",
        height: "13%",
        bottom: "0",
        bubbleParent: true,
        id: "__alloyId1"
    });
    $.__views.dbwindow.add($.__views.__alloyId1);
    $.__views.back1 = Ti.UI.createButton({
        bubbleParent: true,
        width: "25%",
        height: "100%",
        title: "Back",
        id: "back1"
    });
    $.__views.__alloyId1.add($.__views.back1);
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
        title: "Currently Selected Boat Stats!",
        id: "savedboats"
    });
    $.__views.tab3scroll = Ti.UI.createScrollView({
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "100%",
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
    $.__views.back2 = Ti.UI.createButton({
        bubbleParent: true,
        width: "25%",
        height: "100%",
        title: "Back",
        id: "back2"
    });
    $.__views.__alloyId2.add($.__views.back2);
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
    var backbuttons = [ $.back1, $.back2 ];
    makeBoatButtonsFromDB();
    backbuttons.forEach(back);
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
    $.edit.addEventListener("click", function() {
        function getvalues(element) {
            textValues.push(element.value);
        }
        if (validateData()) {
            var textValues = [];
            textFields.forEach(getvalues);
            updateBoatInDB(textValues);
            $.tabgroup.setActiveTab(1);
        }
    });
    $.deleteBT.addEventListener("click", function() {
        deleteBoatInDB($.boatName.value);
        $.tabgroup.setActiveTab(1);
    });
    $.exit.addEventListener("click", function() {
        0 == "android".toString().toLowerCase().localeCompare("android") ? Ti.Android.currentActivity.finish() : 0 == "android".toString().toLowerCase().localeCompare("mobileweb") && alert("You Hit Exit");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;