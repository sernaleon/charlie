RealtorApp.resultsGallery = function (params) {
    //index in gallery change
    var index = ko.observable(0);
    index.subscribe(function (value) { });
    //custom title for phone/tablet
    var isPhone = DevExpress.devices.current().screenSize === "small";
    var customTitle = isPhone ? '' : 'Marketplace Plaze';

    var viewModel = {
        //  Put the binding properties here
         title: customTitle,
         index: index,
         galleryData : [
           { src: "image.jpg", price: "$1000,00", place: "90099 Pic st.", square: "350 sq. ft.", index: 0 },
           { src: "image2.jpg", price: "$1000,00", place: "90099 Pic st.", square: "350 sq. ft.", index: 1 },
           { src: "image.jpg", price: "$1000,00", place: "90099 Pic st.", square: "350 sq. ft." },
           { src: "image2.jpg", price: "$1000,00", place: "90099 Pic st.", square: "350 sq. ft." },
           { src: "image.jpg", price: "$1000,00", place: "90099 Pic st.", square: "350 sq. ft." },
         ],
         goToList: function () { RealtorApp.app.navigate('resultsList'); },
         goToMap: function () { RealtorApp.app.navigate('resultsMap'); },
         goToGallery: function () {  }
    };

    
    return viewModel;
};