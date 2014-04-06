"use strict";

DXWorkout.createSetViewModel = function(allSets) {
    var weight = ko.observable(),
        reps = ko.observable();

    function fromJS(obj) {
        weight(obj.weight);
        reps(obj.reps);
    }

    function toJS() {
        return {
            weight: weight(),
            reps: reps()
        };
    }

    function canDelete() {
        return allSets().length > 1;
    }

    function handleDelete() {
        var context = ko.contextFor(event.target || event.srcElement);
        var index = context.$index();


        if(allSets().length <= 1)
            throw Error("number of sets must be greater than zero");

        allSets.splice(index, 1);
    }


    return {
        weight: weight,
        reps: reps,
        weightUnit: DXWorkout.settings["weightUnit"],

        handleDelete: handleDelete,
        canDelete: canDelete,

        toJS: toJS,
        fromJS: fromJS
    }
};