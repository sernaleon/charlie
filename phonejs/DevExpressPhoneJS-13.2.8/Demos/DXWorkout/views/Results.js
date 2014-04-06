"use strict";

DXWorkout.Results = function(params) {
    var wo = DXWorkout,
        id = params.item,
        workout = ko.observable();

    return {
        hideNavigationButton: !id,
        workout: workout,

        viewShown: function () {
            $(".dx-active-view .dx-scrollable").data("dxScrollView").scrollTo(0);
        },

        viewShowing: function(args) {
            workout(id ? wo.getWorkoutById(id) : wo.currentWorkout);
            var renderResult = args.viewInfo.renderResult;
        }
    };
}