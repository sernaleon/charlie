"use strict";

DXWorkout.Exercise = function(params) {
    var wo = DXWorkout,
        action = params.action,
        workout = ko.observable(),
        exercise = ko.observable(),
        title = ko.observable(""),
        commandsVisible = ko.observable(false),
        cancelCommands = [
            { text: "Cancel exercise", clickAction: cancelExercise },
            { text: "Cancel workout", clickAction: cancelWorkout }
        ];

    function handleCancel() {
        commandsVisible(true);
    }

    function cancelExercise() {
        commandsVisible(false);
        wo.app.back();
    };

    function cancelWorkout() {
        commandsVisible(false);
        wo.currentWorkout.cancelCurrentWorkout();
    };

    function handleAddSet() {
        workout().handleAddSet();
        $(".dx-active-view .dx-scrollview").data("dxScrollView").update();
    };

    return {
        hideNavigationButton: true,

        title: title,
        workout: workout,
        exercise: exercise,
        cancelVisible: !wo.hardwareBackButton && wo.app.canBack(),
        cancelCommands: cancelCommands,
        commandsVisible: commandsVisible,

        handleCancel: handleCancel,
        backButtonDown: handleCancel,
        handleAddSet: handleAddSet,

        viewShown: function() {
            $(".dx-active-view .dx-scrollable").data("dxScrollView").scrollTo(0);
        },

        viewShowing: function(args) {
            var currentWorkout = wo.currentWorkout,
                currentExercise = currentWorkout.currentExercise(),
                exerciseCount = currentWorkout.exercises().length;

            workout(currentWorkout);
            exercise(currentExercise);
            title('#' + exerciseCount + ' ' + currentExercise.name());
        }
    };
}