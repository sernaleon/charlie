RealtorApp.Details = function (params) {

    var MAP_CONTAINER = ".details .map",
        MAP_INNER = ".details .map-inner",
        MAX_MAP_WIDTH = 640;

    var isPhone = DevExpress.devices.current().screenSize === "small",
        homeItem = ko.observable(null),
        images = ko.observableArray(),
        isLoaded = ko.observable(false),
        loadPanelVisible = ko.observable(false),
        loadPanelMessage = ko.observable(""),
        title = ko.observable(""),
        status = ko.observable("")

    function loadData(id) {
        isLoaded(false);
        loadPanelVisible(true);
        loadPanelMessage('Please wait... Loading data');

        RealtorApp.data.getPropertyInfo(id).done(function (result) {
            $.each(result.Images, function (_, image) {
                images.push("url(" + image + ")");
            });

            result.Price = Globalize.format(result.Price, "c0");
            result.HouseSize = Globalize.format(result.HouseSize, "n0");

            switch (result.Status) {
                case '0': status('Active');
                    break;
                case '1': status('Selling');
                    break;
                case '2': status('Sold');
                    break;
                default: status('Unknown');
            }

            homeItem(result);
            title(result.Address);
            isLoaded(true);
            loadPanelVisible(false);
            updateMap();
        });
    }

    function updateMap() {
        var mapHeight = "100%",
            mapWidth = "100%",
            provider = "bing",
            scrollElement = $(".dx-active-view .tablet-scrollable");
        if (isPhone) {
            mapHeight = $(MAP_CONTAINER).height();
            mapWidth = $(MAP_CONTAINER).width();
            provider = "googleStatic";
            mapWidth = (mapWidth > MAX_MAP_WIDTH) ? MAX_MAP_WIDTH : mapWidth;
            scrollElement = $(".dx-active-view .details");
        }

        $(MAP_INNER).dxMap({
            location: homeItem().Coordinates,
            width: mapWidth,
            height: mapHeight,
            zoom: 12,
            provider: provider,
            markers: [{ location: homeItem().Coordinates }],
            markerIconSrc: "http://demos.devexpress.com/DevExtreme/RealtorApp/images/map-marker.png"
        });
        scrollElement.dxScrollView({});
        scrollElement.data("dxScrollView").scrollTo(0);
    }

    var viewModel = {
        //  Put the binding properties here
        homeItem: homeItem,
        images: images,
        isLoaded: isLoaded,
        loadPanelVisible: loadPanelVisible,
        loadPanelMessage: loadPanelMessage,
        isPhone: isPhone,
        title: title,
        status: status,
        favButtonText: ko.observable(null),
        viewShowing: function () {
            loadData(params.id);
        }
    };

    return viewModel;
};