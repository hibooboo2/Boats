module.exports = [ {
    isApi: true,
    priority: 1000.0002,
    key: "Window",
    style: {
        backgroundColor: "#fff",
        bubbleParent: true,
        tabBarHidden: true
    }
}, {
    isApi: true,
    priority: 1000.0003,
    key: "TabGroup",
    style: {
        tabHeight: 0,
        navBarHidden: true
    }
}, {
    isApi: true,
    priority: 1000.0004,
    key: "TableView",
    style: {
        rowHeight: "100px"
    }
}, {
    isApi: true,
    priority: 1000.0005,
    key: "Label",
    style: {
        width: "100%",
        height: "13%",
        color: "#000",
        font: {
            fontSize: "50%",
            fontFamily: "Helvetica Neue"
        },
        textAlign: "center",
        bubbleParent: true,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    }
}, {
    isApi: true,
    priority: 1000.0006,
    key: "Button",
    style: {
        bubbleParent: true,
        width: "33%",
        height: "100%"
    }
}, {
    isApi: true,
    priority: 1000.0007,
    key: "ScrollView",
    style: {
        top: 0,
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "87%",
        width: "100%",
        layout: "vertical"
    }
}, {
    isApi: true,
    priority: 1000.0008,
    key: "TextField",
    style: {
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
        bubbleParent: true
    }
}, {
    isApi: true,
    priority: 1000.0009,
    key: "View",
    style: {
        layout: "horizontal",
        width: "100%",
        height: "13%",
        bottom: "0",
        bubbleParent: true
    }
}, {
    isId: true,
    priority: 100000.001,
    key: "add",
    style: {
        image: "Button-Add-icon.png"
    }
}, {
    isId: true,
    priority: 100000.0011,
    key: "boatTable",
    style: {
        minRowHeight: "50px",
        maxRowHeight: "10%"
    }
} ];