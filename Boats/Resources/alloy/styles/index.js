module.exports = [ {
    isApi: true,
    priority: 1000.0002,
    key: "Window",
    style: {
        backgroundColor: "#fff",
        bubbleParent: true
    }
}, {
    isApi: true,
    priority: 1000.0003,
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
    priority: 1000.0004,
    key: "Button",
    style: {
        bubbleParent: true,
        width: "25%",
        height: "100%"
    }
}, {
    isApi: true,
    priority: 1000.0005,
    key: "ScrollView",
    style: {
        bubbleParent: true,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: false,
        scrollType: "vertical",
        height: "100%",
        width: "100%",
        layout: "vertical"
    }
}, {
    isApi: true,
    priority: 1000.0006,
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
    priority: 1000.0007,
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
    priority: 100000.0008,
    key: "boatName",
    style: {
        clearOnEdit: false
    }
} ];