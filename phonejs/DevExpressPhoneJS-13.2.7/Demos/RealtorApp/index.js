window.RealtorApp = window.RealtorApp || {};

$(function () {
    DevExpress.devices.current().platform = "generic";
    RealtorApp.app = new DevExpress.framework.html.HtmlApplication({
        namespace: RealtorApp,
        navigationType: RealtorApp.config.navigationType,
        navigation: RealtorApp.config.navigation,
        navigateToRootViewMode: "keepHistory",
        commandMapping: RealtorApp.config.commandMapping
    });
    RealtorApp.app.router.register(":view/:id/:type", { view: "Home", id: undefined, type: undefined });
    RealtorApp.app.viewRendered.add(function(viewInfo) {
        if(viewInfo.viewTemplateInfo.toolbar === false)
            viewInfo.renderResult.$markup.addClass("hide-toolbar");
    });
   

    var device = DevExpress.devices.current();

    function setScreenSize() {
        var el = $("<div>").addClass("screen-size").appendTo(".dx-viewport");
        var size = getComputedStyle(el[0], ":after").content.replace(/"/g, "");
        el.remove();
        device.screenSize = size;        
    };
    $(window).bind("resize", setScreenSize);
    setScreenSize();
    RealtorApp.app.navigate();
});


!function () {
    var FAVES_STORAGE_KEY = 'realtorapp-favorites';

    var loadFavesFromStorage = function () {
        var rawFaves = localStorage.getItem(FAVES_STORAGE_KEY),
            faves = JSON.parse(rawFaves || '[]');
        $.each(faves, function (_, value) {
            value.IsFavorite = ko.observable(true);
        });
        return faves;
    }

    var saveFavesToStorage = function () {
        localStorage.setItem(FAVES_STORAGE_KEY, JSON.stringify(faves()));
    }
    
    var faves = ko.observableArray(loadFavesFromStorage());

    ko.computed(function () {
        saveFavesToStorage();
    });

    var findFavedProperty = function (property) {
        if (!property)
            return null;
        var result = $.grep(faves(), function (item) {
            return item.ID === property.ID;
        });
        return result[0];
    }

    $.extend(RealtorApp, {
        faves: faves,
        findFavedProperty: findFavedProperty,
        loadFavesFromStorage: loadFavesFromStorage,
        saveFavesToStorage: saveFavesToStorage
   });

}();