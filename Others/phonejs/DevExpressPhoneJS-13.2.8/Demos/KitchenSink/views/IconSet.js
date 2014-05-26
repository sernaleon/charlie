KitchenSink.IconSet = function (params) {
    var icons = $.map(KitchenSink.db.icons, function(name) {
        return {
            name: name,
            cssClass: "dx-icon-" + name.toLowerCase()
        };
    });

    return {
       icons: icons 
    };
};