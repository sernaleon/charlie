
RealtorApp.Home = function (params) {
    var isPhone = DevExpress.devices.current().screenSize === "small",
        watchToken = null,
        loadPanelMessage = ko.observable(""),
        loadPanelVisible = ko.observable(false),
        listData = ko.observableArray([]),
        errorMessage = ko.observable(""),
        isSearchActive = ko.observable(false);

    function loadData() {
        loadPanelVisible(true);
        loadPanelMessage("Please wait... Loading data");     
        RealtorApp.data.getBestOffers(isPhone ? 3 : 5).done(function (result) {
            $.each(result, function(index, item) {
                listData.push({
                    image: "url(" + item.Images[0] + ")",
                    price: Globalize.format(item.Price, "c0"),
                    priceCss: "price" + index,
                    doubleCss: index ? "item" + index : "double",
                    ID: item.ID
                });
            });           
            loadPanelVisible(false);
        });
    }
    
    function getCurrentPositionSuccess(position) {
        navigator.geolocation.clearWatch(watchToken);
        loadPanelVisible(false);
        RealtorApp.app.navigate(
            "Results/" +
            position.coords.latitude + "," +
            position.coords.longitude + 
            "/coordinates");
    }

    function getCurrentPositionFail(error) {
        switch (error.code) {
            case 1:
                errorMessage("The use of location is currently disabled.");
                break;
            default:
                errorMessage("Unable to detect current location. Please ensure location is turned on in your phone settings and try again.");
        }
        loadPanelVisible(false);
    }
    
    var viewModel = {
        listData: listData,
        loadPanelVisible: loadPanelVisible,
        loadPanelMessage: loadPanelMessage,
        errorMessage: errorMessage,
        isSearchActive: isSearchActive,
        errorVisible: ko.computed(function() {
            return errorMessage().length != 0;
        }),
        hideError: function() {
            errorMessage("");
        },
        text: ko.observable(""),
        homeItemClick: function(object) {
            RealtorApp.app.navigate("Details/" + object.model.ID);
        },
        searchItemClick: function () {
            if (!this.text()) {
                errorMessage("Please enter the search string.");
                return;
            };
            RealtorApp.app.navigate("Results/" + this.text() + "/searchstring");
        },
        locationItemClick: function () {
            loadPanelVisible(true);
            errorMessage("");
            loadPanelMessage("Getting coordinates. Please wait...");
            if (navigator.geolocation)
                watchToken = navigator.geolocation.watchPosition(getCurrentPositionSuccess, getCurrentPositionFail);
            else {
                errorMessage("Geolocation is not supported by this device.");
            }
        },
        viewShowing: function (args) {
            if (args.viewInfo.renderResult)
                isSearchActive(false);
            else
                loadData();
        },
        showSearchControls: function() {
            if (!isSearchActive()) {
                isSearchActive(true);
                setTimeout(function () {
                    $(".search-text").data("dxTextBox").focus();
                }, 500);  
            }
        }
        
    };

    return viewModel;
};