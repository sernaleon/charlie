RealtorApp.Results = function(params) {
    var isPhone = DevExpress.devices.current().screenSize === "small";
    var customTitle = ko.observable("");
    
    var ITEM_LIST = "list",
        ITEM_MAP = "map",
        ITEM_GALLERY = "gallery";

    var loadPanelVisible = ko.observable(false),
        loadPanelMessage = ko.observable(''),
        listData = ko.observableArray([]),
        isLoaded = ko.observable(false),
        mapMarkers = ko.observableArray([]),
        activeItem = ko.observable(ITEM_LIST);
      
    function initializeResult() {
        return function (result) {
            listData(result);
            mapMarkers(markersByCoordinates(result));
            loadPanelVisible(false);
            isLoaded(true);
        }
    }

    function loadData() {
        loadPanelVisible(true);
        loadPanelMessage('Please wait... Loading data');
        if (params.type === 'searchstring') {
            if (!isPhone) customTitle(params.id);
            RealtorApp.data.getPropertiesByPlaceName(params.id).done(initializeResult());
        } else {
            if (!isPhone) customTitle("My location");
            RealtorApp.data.getPropertiesByCoordinates(params.id).done(initializeResult());
        }
        
    }
       
    function markersByCoordinates(array) {
        var markers = [];
        for (var i = 0; i < array.length; i++) {
            markers.push({ location: array[i].Coordinates, clickAction: '#Details/' + array[i].ID });
        }
        return markers;
    }

    function getComputedIcon(itemName) {
        return ko.computed(function() {
            return itemName + (activeItem() == itemName ? '-selected' : '');
        });
    }
   
    var viewModel = {
        title: customTitle,
        listData: listData,
        loadPanelVisible: loadPanelVisible,
        loadPanelMessage: loadPanelMessage,
        isLoaded: isLoaded,
        activeItem: activeItem,
        iconList: getComputedIcon(ITEM_LIST),
        mapMarkers: mapMarkers,
        iconMap: getComputedIcon(ITEM_MAP),
        iconGallery: getComputedIcon(ITEM_GALLERY),

        resultsItemClick: function(item) {
            RealtorApp.app.navigate("Details/" + item.model.ID);
        },
        goToList: function () {
            viewModel.activeItem(ITEM_LIST);
        },
        goToMap: function () {
            viewModel.activeItem(ITEM_MAP);
        },
        goToGallery: function () {
            viewModel.activeItem(ITEM_GALLERY);
        },
    
        viewShowing: function (args) {
            if (!args.viewInfo.renderResult) {
                loadData();
            }        
        } 
    };

    return viewModel;
};