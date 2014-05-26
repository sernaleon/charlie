(function() {
    var endpointSelector = new DevExpress.EndpointSelector(DXSK8.config.endpoints);

    var serviceConfig = $.extend(true, {}, DXSK8.config.services, {
        db: {
            url: endpointSelector.urlFor("db"),
            jsonp: !window.WinJS,
            withCredentials: true,

            errorHandler: function(error) {
                console.log("Data service error: " + error.message + " " + (error.stacktrace || ""));
            }
        }
    });

    DXSK8.ORDER_STATES = {
        "draft": {
            id: 0,
            name: "Orders in draft"
        },
        "new": {
            id: 1,
            name: "New orders"
        },
        "in-progress": {
            id: 2,
            name: "In progress"
        },
        "completed": {
            id: 3,
            name: "Recently completed"
        },
        "out-of-stock": {
            id: 4,
            name: "Out-of-stock items"
        }
    };

    DXSK8.db = new DevExpress.data.ODataContext(serviceConfig.db);
    DXSK8.db.getImage = function(relativeUrl) {
        return endpointSelector.urlFor("storage") + relativeUrl;
    };

    // Initialize session connection to service
    DXSK8.db.invoke("StartSession");

}());