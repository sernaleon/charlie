window.RealtorApp = window.RealtorApp || {};
window.RealtorApp.data = window.RealtorApp.data || {};

$(function() {
    var TIMEOUT = 1000;

    function getPropertiesByCoordinates(latitude, longitude) {
        var result = $.Deferred();
        setTimeout(function() {
            var properties = [];
            $.each(RealtorApp.data.SampleData, function(_, value) {
                properties.push(new RealtorApp.data.PropertyViewModel(value));
            });
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
    }

    function getPropertiesByPlaceName(name) {
        var result = $.Deferred();
        setTimeout(function () {
            var properties = [];
            $.each(RealtorApp.data.SampleData, function(_, value) {
                properties.push(new RealtorApp.data.PropertyViewModel(value));
            });
            result.resolve(properties);
        }, TIMEOUT);
        return result.promise();
    }

    function getPropertyInfo(id) {
        var current = null;
        $.each(RealtorApp.data.SampleData, function(_, value) {
            if(value.ID == id)
                current = value;
        });

        var result = $.Deferred();
        setTimeout(function () {
            result.resolve(new RealtorApp.data.PropertyViewModel(current));
        }, TIMEOUT);
        return result.promise();
    }

    function getBestOffers(take) {
        var result = $.Deferred(),
            bestOffersList = [21, 15, 7, 18, 3],
            topProperties = [];
        if (!take || isNaN(take) || take > bestOffersList.length)
            take = bestOffersList.length;

        setTimeout(function () {
            for (var i = 0; i < take; i++)
                topProperties.push(new RealtorApp.data.PropertyViewModel(RealtorApp.data.SampleData[bestOffersList[i]]));
            result.resolve(topProperties);
        }, TIMEOUT);
        return result.promise();
    }

    $.extend(RealtorApp.data, {
        getPropertiesByCoordinates: getPropertiesByCoordinates,
        getPropertiesByPlaceName: getPropertiesByPlaceName,
        getPropertyInfo: getPropertyInfo,
        getBestOffers: getBestOffers
    });
})