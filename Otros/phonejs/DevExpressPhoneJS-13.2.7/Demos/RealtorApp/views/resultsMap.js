RealtorApp.resultsMap = function (params) {
    //custom title for phone/tablet
    var isPhone = DevExpress.devices.current().screenSize === "small";
    var customTitle = isPhone ? '' : 'Marketplace Plaze';

    var viewModel = {
        //  Put the binding properties here
        title: customTitle,
        mapMarkers: [
            {
                title: "A marker",
                location: [40.749802, -73.981018],
                clickAction: function () { DevExpress.ui.notify("Marker 'A' clicked!", "info", 1000); }
            },
            {
                title: "B marker",
                location: [40.749825, -73.987963],
                clickAction: function () { DevExpress.ui.notify("Marker 'B' clicked!", "info", 1000); }
            },
            {
                title: "C marker",
                location: [40.755823, -73.986397],
                clickAction: function () { DevExpress.ui.notify("Marker 'C' clicked!", "info", 1000); }
            }
        ],
        goToList: function () { RealtorApp.app.navigate('resultsList'); },
        goToMap: function () {  },
        goToGallery: function () { RealtorApp.app.navigate('resultsGallery'); }
    };

    return viewModel;
};