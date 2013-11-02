
// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
if (Ti.Platform.osname.toString().toLowerCase().localeCompare("mobileweb") != 0) {
	var boatsdb = Ti.Database.open('boatsDB');

	boatsdb.execute('CREATE TABLE IF NOT EXISTS theBoats(id INTEGER PRIMARY KEY, boatName TEXT, loa REAL, lwl REAL, beam REAL, displacement REAL, sailArea REAL);');
	boatsdb.close();
}