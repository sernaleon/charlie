window.RealtorApp = window.RealtorApp || {};
window.RealtorApp.data = window.RealtorApp.data || {};

RealtorApp.data.PropertyViewModel = function(property) {
    if(property == null)
        return;

    $.extend(this, property);
    this.IsFavorite = ko.computed(function() {
        return !!RealtorApp.findFavedProperty(property);
    });
};

RealtorApp.data.PropertyViewModel.prototype.changeFavState = function (e) {
    var me = e.model;
    if (me.IsFavorite())
        RealtorApp.faves.remove(function (item) { return item.ID == me.ID });
    else
        RealtorApp.faves.push(me);
};