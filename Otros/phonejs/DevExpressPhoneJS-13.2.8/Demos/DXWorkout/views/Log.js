"use strict";

DXWorkout.Log = function (params) {
    var log = ko.computed(function() {
        return DevExpress.data.query(DXWorkout.workouts())
            .sortBy(function(item) { return new Date(item.startDate); }, "desc")
            .groupBy(function(item) { return Globalize.format(new Date(item.startDate), "MMM yyyy"); })
            .toArray();
    });

    function handleItemClick(e) {
        DXWorkout.app.navigate("Results/show/" + e.itemData.id);
    };

    return {
        log: log,
        handleItemClick: handleItemClick,

        viewShown: function() {
            $(".dx-active-view .dx-scrollable").data("dxScrollView").scrollTo(0);
        }
    };
};