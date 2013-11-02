var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

if (0 != "android".toString().toLowerCase().localeCompare("mobileweb")) {
    var boatsdb = Ti.Database.open("boatsDB");
    boatsdb.execute("CREATE TABLE IF NOT EXISTS theBoats(id INTEGER PRIMARY KEY, boatName TEXT, loa REAL, lwl REAL, beam REAL, displacement REAL, sailArea REAL);");
    boatsdb.close();
}

Alloy.createController("index");