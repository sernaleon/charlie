"use strict";

DXWorkout.Settings = function(params) {
    var viewModel = {
        lengthUnits: ["miles", "km"],
        weightUnits: ["lbs", "kg"],

        length: DXWorkout.settings["lengthUnit"],
        weight: DXWorkout.settings["weightUnit"],

        editGoals: function() {
            DXWorkout.app.navigate('List/edit/goal');
        },

        editExercises: function() {
            DXWorkout.app.navigate('List/edit/exercise');
        }
    };

    viewModel.length.subscribe(function(value) {
        DXWorkout.saveSettings("lengthUnit", value);
    });

    viewModel.weight.subscribe(function(value) {
        DXWorkout.saveSettings("weightUnit", value);
    });

    return viewModel;
};