$.tabgroup.open();

var textFields = [$.boatName, $.loa, $.lwl, $.beam, $.displacement, $.sailArea];
var windows = [$.addboat, $.dbwindow, $.savedboats];
var backbuttons = [$.back1, $.back2];
makeBoatButtonsFromDB();
backbuttons.forEach(back);
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
 This is the listener that allows you to edit a boat. Upon editing it you are switched to
 the boat viewing screen. 
 */
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
});

$.deleteBT.addEventListener('click', function(e) {
	deleteBoatInDB($.boatName.value);
	$.tabgroup.setActiveTab(1);
});

$.exit.addEventListener('click', function(e) {
	if (Ti.Platform.osname.toString().toLowerCase().localeCompare("android") == 0) {
		Ti.Android.currentActivity.finish();
	} else if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") == 0) {
		alert("You Hit Exit");
	}
	;
});

function saveBoatbutton(boatproperties) {
	// Create a Button.
	boatproperties.reverse();
	var aButton = Ti.UI.createLabel({
		window : $.tab2scroll,
		text : boatproperties.pop(),
		height : "13%",
		width : "100%",
		font : {
			fontSize : "50%",
			fontFamily : 'Helvetica Neue'
		},
		loa : boatproperties.pop(),
		lwl : boatproperties.pop(),
		beam : boatproperties.pop(),
		displacement : boatproperties.pop(),
		sailArea : boatproperties.pop()
	});
	// Listen for click events.
	aButton.addEventListener('click', function() {
		calcBoat(aButton.text, aButton.loa, aButton.lwl, aButton.beam, aButton.displacement, aButton.sailArea);
		textFields[0].value = aButton.text;
		textFields[1].value = aButton.loa;
		textFields[2].value = aButton.lwl;
		textFields[3].value = aButton.beam;
		textFields[4].value = aButton.displacement;
		textFields[5].value = aButton.sailArea;
		$.tabgroup.setActiveTab(2);
	});

	// Add to the parent view.
	$.tab2scroll.add(aButton);

};

function calcBoat(boatName, loa, lwl, beam, displacement, sailArea) {
	$.selectedBoat.text = boatName + " is currently selected!";
	$.maxHullSpeed.text = "Max Hull Speed: " + Math.round((1.34 * Math.sqrt(+(lwl))) * 100) / 100;
	$.dL.text = "D/L: " + Math.round((+(displacement) / 2240.0) / Math.pow((.01 * +(lwl)), 3) * 100) / 100;
	$.sAD.text = "SA/D: " + Math.round((+(sailArea) / Math.pow((+(displacement) / 64.0), .67)) * 100) / 100;
	$.capI.text = "Capsize Index: " + Math.round((+(beam) / Math.pow((+(displacement) / 64.0), .33)) * 100) / 100;
	$.comfI.text = "Comfort Index: " + Math.round((+(displacement) / (0.65 * (0.7 * +(lwl) + 0.3 * +(loa)) * Math.pow(+(beam), 1.33))) * 100) / 100;
};

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

function makeBoatButtonsFromDB() {
	function makeTheBoatButton(element, index, array) {
		saveBoatbutton(element);
	};
	var boats = getBoatsFromDB();
	boats.forEach(makeTheBoatButton);
	return boats;
}

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
	}
}

function updateBoatViewer() {
	$.tab2scroll.removeAllChildren();
	makeBoatButtonsFromDB();
}

function validateData() {
	var valid = true;
	function validateField(element, index, array) {
		if (element.value.localeCompare("") == 0) {
			valid = false;
			element.setValue("");
			alert("Please enter something in the " + element.hintText + " box.");
		} else if (index != 0) {
			if (isNaN(element.value)) {
				valid = false;
				element.setValue("");
				alert("Please enter a number in the" + element.hintText + " box.");
			} else if (parseFloat(element.value) == 0) {
				valid = false;
				element.setValue("");
				alert("The" + element.hintText + "cannot be 0.");
			}
		}

	};
	textFields.forEach(validateField);
	return valid;
}

function back(element, index, array) {
	element.addEventListener('click', function(e) {
		$.tabgroup.setActiveTab(index);
	});
};

function swiped(element, index, array) {
	element.addEventListener('swipe', function(e) {
		if (e.direction == 'left') {
			$.tabgroup.setActiveTab(index + 1);
		} else if (e.direction == 'right') {
			$.tabgroup.setActiveTab(index - 1);
		}
	});
};