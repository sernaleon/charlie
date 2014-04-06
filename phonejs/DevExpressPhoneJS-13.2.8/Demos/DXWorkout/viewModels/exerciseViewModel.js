"use strict";

DXWorkout.createExerciseViewModel = function() {
    var name = ko.observable(""),
        sets = ko.observableArray([{}]);

    function setViewModelFromData(data) {
        var vm = DXWorkout.createSetViewModel(sets);
        vm.fromJS(data);
        return vm;
    }

    function fromJS(data) {
        name(data.name);
        sets($.map(data.sets, setViewModelFromData));
    }

    function toJS() {
        return {
            name: name(),
            sets: $.map(sets(), function(item) { return item.toJS(); })
        };
    }

    return {
        name: name,
        sets: sets,

        toJS: toJS,
        fromJS: fromJS
    };
};