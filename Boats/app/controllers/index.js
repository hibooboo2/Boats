$.tabgroup.open();

var textFields = [$.boatName, $.loa, $.lwl, $.beam, $.displacement, $.sailArea];
var windows = [$.addboat, $.dbwindow, $.savedboats];
makeBoatButtonsFromDB();
windows.forEach(swiped);

/*
 This adds a listner to the save button. When clicked the save button will make a new
 boat in the database and update the view with the new boat if the data is valid.
 Next it will switch to the boat viewing tab.
 */
$.save.addEventListener('click', function(e) {
    if (validateData()) {
        addBoatToDB();
        var test = [];
        function getvalues(element, index, array) {
            test.push(element.value);
        };
        textFields.forEach(getvalues);
        saveBoatbutton(test);
        $.tabgroup.setActiveTab(1);
    }
});

/*
 This listener is to make the cancel button on the add boat screen send you
 back to the list of boats.
 */
$.cancel.addEventListener('click', function() {
    $.tabgroup.setActiveTab(1);
});

/*
 Clears the text fields in the add screen then switches to the add boat screen
 when the add button is clicked.
 */
$.add.addEventListener('click', function(e) {
    textFields.forEach(function(element, index, array) {
        element.value = "";
    });
    $.tabgroup.setActiveTab(0);
});
/*
 This is the listener that allows you to edit a boat. Upon editing it you are switched to
 the boat stats viewing screen.
 */
/*
 $.edit.addEventListener('click', function(e) {
 if (validateData()) {
 var textValues = [];
 function getvalues(element, index, array) {
 textValues.push(element.value);
 };
 textFields.forEach(getvalues);
 updateBoatInDB(textValues);
 $.tabgroup.setActiveTab(1);
 }
 });*/

/*
 This is the listener for the exit button. It exits the app in android, displays an alert
 in the other oses.
 */
$.exit.addEventListener('click', function(e) {
    if (Ti.Platform.osname.toString().toLowerCase().localeCompare("android") == 0) {
        Ti.Android.currentActivity.finish();
    } else {
        alert("You Hit Exit");
    }
    ;
});
/*
 This listener is so that the back button on the boat stats tab will
 send you back to the list of boats.
 */
$.home.addEventListener('click', function(e) {
    $.tabgroup.setActiveTab(1);
});

/*
 @method saveBoatbutton
 This method takes in the properties of a boat as an array.
 Then adds that boat to the table of boats.
 */
function saveBoatbutton(boatproperties) {
    // Create a Button.
    boatproperties.reverse();
    var row = Ti.UI.createTableViewRow({
        height : "100px"
    });
    var image = Ti.UI.createImageView({
        url : 'KS_nav_ui.png'
    });
    // var deleteBT = Ti.UI.createButton({
    // right : 10,
    // image : 'delete.png',
    // width : "20%",
    // title : "Delete this boat."
    // });

    var viewBT = Ti.UI.createButton({
        left : "50%",
        width : "25%",
        title : "View this boat.",
        height : "80%"
    });
    var boatLabel = Ti.UI.createLabel({
        text : boatproperties.pop(),
        loa : boatproperties.pop(),
        lwl : boatproperties.pop(),
        beam : boatproperties.pop(),
        displacement : boatproperties.pop(),
        sailArea : boatproperties.pop(),
        left : 10,
        color : "#000"
    });
    row.add(boatLabel);
    row.add(image);
    row.add(viewBT);
    $.boatTable.appendRow(row);
    // Listen for click events on the label.
    viewBT.addEventListener('click', function() {
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

/*
 @method calcBoat
 This takes in the specs of a boat and calculates its specs.
 Then is sets the text for the boat stats screen to display the stats.
 @param {String} boatName Name of the Boat.
 @param {String} loa Length of the entire boat.
 @param {String}	lwl Length of the waterline level.
 @param {String}	beam Lenght of the vessel at its widest point.
 @param {String} displacement The total displacement of water.
 @param {String} sailArea The area of the Sail.
 */
function calcBoat(boatName, loa, lwl, beam, displacement, sailArea) {
    $.selectedBoat.text = boatName + " is currently selected!";
    $.maxHullSpeed.text = "Max Hull Speed: " + Math.round((1.34 * Math.sqrt(+(lwl))) * 100) / 100;
    $.dL.text = "D/L: " + Math.round((+(displacement) / 2240.0) / Math.pow((.01 * +(lwl)), 3) * 100) / 100;
    $.sAD.text = "SA/D: " + Math.round((+(sailArea) / Math.pow((+(displacement) / 64.0), .67)) * 100) / 100;
    $.capI.text = "Capsize Index: " + Math.round((+(beam) / Math.pow((+(displacement) / 64.0), .33)) * 100) / 100;
    $.comfI.text = "Comfort Index: " + Math.round((+(displacement) / (0.65 * (0.7 * +(lwl) + 0.3 * +(loa)) * Math.pow(+(beam), 1.33))) * 100) / 100;
}

/*
 @method getBoatsFromDB
 This function will get all of the boats from the database and return
 them as an array in all but webmobile.
 */
function getBoatsFromDB() {
    var foundboats = [];
    if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") != 0) {
        var boatsdb = Ti.Database.open('boatsDB');
        var boats = boatsdb.execute('SELECT * FROM theBoats');
        while (boats.isValidRow()) {
            var values = [];
            values.push(boats.fieldByName('boatName'));
            values.push(boats.fieldByName('loa'));
            values.push(boats.fieldByName('lwl'));
            values.push(boats.fieldByName('beam'));
            values.push(boats.fieldByName('displacement'));
            values.push(boats.fieldByName('sailArea'));
            foundboats.push(values);
            boats.next();
        }
        boatsdb.close();
    }
    return foundboats;
}

/*
 @method makeBoatButtonsFromDB
 This function adds the buttons for all the stored boats to the boats
 view within the application.
 */
function makeBoatButtonsFromDB() {
    function makeTheBoatButton(element, index, array) {
        saveBoatbutton(element);
    };
    var boats = getBoatsFromDB();
    boats.forEach(makeTheBoatButton);
    return boats;
}

/*
 @method addBoatToDB
 This method adds a boat to the database in all but modileweb, using
 the values in the text fields in the addboat tab.
 */
function addBoatToDB() {
    if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") != 0) {
        var boatsdb = Ti.Database.open('boatsDB');
        boatsdb.execute('INSERT INTO theBoats (boatName,loa,lwl,beam,displacement,sailArea) VALUES (?,?,?,?,?,?)', $.boatName.value, $.loa.value, $.lwl.value, $.beam.value, $.displacement.value, $.sailArea.value);
        boatsdb.close();
    }
}

function updateBoatInDB(values) {
    if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") != 0) {
        var boatsdb = Ti.Database.open('boatsDB');
        boatsdb.execute('UPDATE theBoats SET boatName=?,loa=?,lwl=?,beam=?,displacement=?,sailArea=? WHERE boatName=? ', values[0], values[1], values[2], values[3], values[4], values[5], values[0]);
        boatsdb.close();
        alert(values[0] + " has been updated.");
    }
}

function deleteBoatInDB(boatName) {
    if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") != 0) {
        var boatsdb = Ti.Database.open('boatsDB');
        boatsdb.execute('DELETE FROM theBoats WHERE boatName=?', boatName);
        boatsdb.close();
        updateBoatViewer();
        alert(boatName + " deleted!");
    } else if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") == 0) {
        $.boatTable.setData(null);
    }
}

function updateBoatViewer() {
    $.boatTable.removeAllChildren();
    makeBoatButtonsFromDB();
}

/*
 @method validateData
 This method validates that the data in the textfields is correct, if
 is incorrect it will return false and display an alert.
 */
function validateData() {
    var valid = true;
    var alertText = "";
    function validateField(element, index, array) {
        if (element.value.localeCompare("") == 0) {
            valid = false;
            element.setValue("");
            alertText += "Please enter something in the " + element.hintText + " box.\n";
        } else if (index != 0) {
            if (isNaN(element.value)) {
                valid = false;
                element.setValue("");
                alertText += "Please enter a number in the" + element.hintText + " box.\n";
            } else if (parseFloat(element.value) == 0) {
                valid = false;
                element.setValue("");
                alertText += "The" + element.hintText + "cannot be 0.\n";
            }
        }

    };
    textFields.forEach(validateField);
    if (!valid) {
        alert(alertText);
    }
    return valid;
}

/*
 This allows switching between tabs when swiped.
 */
function swiped(element, index, array) {
    element.addEventListener('swipe', function(e) {
        if (e.direction == 'left') {
            $.tabgroup.setActiveTab(index + 1);
        } else if (e.direction == 'right') {
            $.tabgroup.setActiveTab(index - 1);
        }
    });
};

function showWin(winNumber) {
    if (winNumber == 0) {
        windows[1].hide();
        windows[2].hide();
        windows[0].show();
    } else if (winNumber == 1) {
        windows[2].hide();
        windows[0].hide();
        windows[1].show();
    } else if (winNumber == 2) {
        windows[1].hide();
        windows[0].hide();
        windows[2].show();
    }
};
