"use strict";

DXWorkout.createWorkoutViewModel = function() {
    var wo = DXWorkout,
        id = ko.observable(),
        caption,
        duration,
        currentExercise,
        startDate = ko.observable(),
        endDate = ko.observable(),
        goal = ko.observable(),
        notes = ko.observable(),
        exercises = ko.observableArray();

    function exerciseViewModelFromData(data) {
        var vm = wo.createExerciseViewModel(exercises);
        vm.fromJS(data);
        return vm;
    }

    function fromJS(data) {
        id(data.id);
        startDate(new Date(data.startDate));
        endDate(data.endDate ? new Date(data.endDate) : null);
        goal(data.goal);
        notes(data.notes);
        exercises($.map(data.exercises, exerciseViewModelFromData));
    }

    function toJS() {
        return {
            id: id(),
            startDate: startDate(),
            endDate: endDate(),
            goal: goal(),
            notes: notes(),
            caption: formatCaption(),
            exercises: $.map(exercises(), function(item) { return item.toJS(); })
        }
    }

    function handleShowResults() {
        endDate(new Date);
        wo.app.navigate("Results");
    }

    function handleDelete() {
        DevExpress.ui.dialog.confirm("Are you sure you want to delete this workout?", "Confirm deletion").done(function (result) {
            if (!result)
                return;
            var currentId = id();
            wo.removeCurrentWorkout();
            wo.deleteWorkout(currentId);
            wo.app.navigate("Log", { direction: 'forward', root: true });
        });
    }

    function handleContinue() {
        if(wo.app.canBack())
            wo.app.back();
        else
            wo.app.navigate("Exercise", { direction: 'backward', root: true });
    }

    function handleFinish() {
        save();
        wo.removeCurrentWorkout();
        wo.app.navigate("Log", { direction: 'forward', root: true });
    }

    function handleAddExercise() {
        var newExercise = wo.createExerciseViewModel();
        newExercise.fromJS({
            sets: [{ weight: 50, reps: 10 }]
        });
        newExercise.exerciseNumber = exercises().length + 1;
        exercises.push(newExercise);

        wo.app.navigate("List/select/exercise");
    }

    function handleAddSet() {
        var exercise = currentExercise(),
            unwrappedSets = exercise.sets(),
            lastSet = unwrappedSets[unwrappedSets.length - 1],
            clonedSet = DXWorkout.createSetViewModel(exercise.sets),
            clonedData = $.extend({}, lastSet.toJS());

        clonedSet.fromJS(clonedData);
        exercise.sets.push(clonedSet);
    }

    function handleNotesChange() {
        if(id())
            save();
    }

    function save() {
        var data = toJS();

        if (typeof (data.startDate) == "object") {
            data.startDate = data.startDate.toJSON();
        }

        if (typeof (data.endDate) == "object") {
            data.endDate = data.endDate.toJSON();
        }       
        
        if(!data.id) {
            var newId = (new DevExpress.data.Guid).toString();
            data.id = newId;
            wo.insertWorkout(data);
        } else {
            wo.updateWorkout(data.id, data);
        }
    }

    function clear() {
        fromJS({
            id: null,
            startDate: new Date,
            endDate: null,
            goal: "",
            notes: "",
            exercises: [],
            currentExercise: null
        });
    }

    function clearCurrentExercise() {
        var exercise = currentExercise();
        exercise.fromJS({
            sets: [{ weight: 50, reps: 10 }]
        });       
    }

    function cancelCurrentWorkout() {
        wo.removeCurrentWorkout();
        wo.app.navigate("Home", { direction: 'backward', root: true });
    }

    function formatCaption() {
        var bag = [Globalize.format(startDate(), "MMM d, yyyy")];

        if(goal())
            bag.push("-", goal());

        if(duration)
            bag.push("(" + duration() + ")");

        return bag.join(" ");
    }

    duration = ko.computed(function() {
        if(startDate() instanceof Date && endDate() instanceof Date) {
            return wo.formatTime((endDate() - startDate()) / 60000);
        }
        return "n/a";
    });

    currentExercise = ko.computed(function() {
        var exercisesArray = exercises(),
            count = exercisesArray.length;
        return count
            ? exercisesArray[count - 1]
            : null;
    });

    return {
        goalList: wo.settings['goal'],
        weightUnit: DXWorkout.settings["weightUnit"],

        id: id,
        duration: duration,
        goal: goal,
        startDate: startDate,
        endDate: endDate,
        notes: notes,
        exercises: exercises,
        currentExercise: currentExercise,

        handleAddSet: handleAddSet,
        handleAddExercise: handleAddExercise,
        handleShowResults: handleShowResults,

        handleContinue: handleContinue,
        handleFinish: handleFinish,
        handleDelete: handleDelete,

        handleNotesChange: handleNotesChange,

        save: save,
        clear: clear,
        clearCurrentExercise: clearCurrentExercise,
        cancelCurrentWorkout: cancelCurrentWorkout,

        toJS: toJS,
        fromJS: fromJS
    };
};