RealtorApp.resultsList = function (params) {

    /*
    var getListByString = function (data) {


    }

    var getListByCoord = function (data) {

    }

    if (params.type == 'searchstring') {
        getListByString(params.data);
    }
    else
        getListByCoord(params.data);
        */
    //custom title for phone/tablet
    var isPhone = DevExpress.devices.current().screenSize === "small";
    var customTitle = isPhone ? '' : 'Marketplace Plaze';
    
    var viewModel = {
        title: customTitle,
        listData: [
            { img: 'image.jpg', price: '10000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '130000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image2.jpg', price: '1030000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '10000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image2.jpg', price: '130000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '34000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image2.jpg', price: '10000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '89000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image2.jpg', price: '465000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '10000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image2.jpg', price: '8900,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
            { img: 'image.jpg', price: '10000,00', place: 'New York, 99000, 454', square: 340, beds: 2, baths: 3 },
        ],
        //listData: ko.observableArray(dataList),
        goToList: function () { },
        goToMap: function () { RealtorApp.app.navigate('resultsMap'); },
        goToGallery: function () { RealtorApp.app.navigate('resultsGallery'); }

     
    };


    return viewModel;
};