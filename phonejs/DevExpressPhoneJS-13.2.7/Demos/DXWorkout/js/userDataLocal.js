"use strict";

!function($, DX, wo, undefined) {
    var DATA_VERSION_KEY = "dxworkout-version",
        WORKOUTS_KEY = "dxworkout-workouts",
        CURRENT_KEY = "dxworkout-current",
        DATA_VERSION = "3",
        OBSERVABLE_SETTINGS = ["lengthUnit", "weightUnit"],
        workoutArray;

    function insertWorkout(workout) {
        workoutArray.push(workout);
        saveWorkouts();
    }

    function updateWorkout(id, workout) {
        var index,
            array = workoutArray();
        for (index = 0; index < array.length; index++) {
            if (array[index].id === id)
                break;
        }

        workoutArray.splice(index, 1, workout);
        saveWorkouts();
    }

    function deleteWorkout(id) {
        workoutArray.remove(function(item) {
            return item.id === id;
        });
        saveWorkouts();
    }

    function saveWorkouts() {
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workoutArray()));
    }

    function getWorkoutById(id) {
        var workout,
            index,
            foundItem,
            array = workoutArray();
        for (index = 0; index < array.length; index++) {
            if (array[index].id === id) {
                foundItem = array[index];
                break;
            }
        }

        workout = wo.createWorkoutViewModel();
        if (foundItem)
            workout.fromJS(foundItem);
        else
            workout.clear();
        return workout;
    }

    function removeCurrentWorkout() {
        wo.currentWorkout = null;
        localStorage.removeItem(CURRENT_KEY);
    }

    function saveCurrentWorkout() {
        if(!wo.currentWorkout)
            return;

        var workout = wo.currentWorkout.toJS(),
            exercises = workout.exercises;   

        if(!workout.goal || exercises.length === 0)
            return;

        if(!exercises[exercises.length - 1].name)
            exercises.pop();

        if(exercises.length)
            localStorage.setItem(CURRENT_KEY, JSON.stringify(workout));
    }

    function getCurrentFromStorage() {
        var storageData = localStorage.getItem(CURRENT_KEY),
            workout,
            MAX_WORKOUT_DURATION_HOURS = 2;

        if(storageData)
            workout = JSON.parse(storageData);

        if(!workout)
            return null;

        var startDate = new Date(workout.startDate),
            currentDate = new Date();
        if(startDate.setHours(startDate.getHours() + MAX_WORKOUT_DURATION_HOURS) < currentDate)
            return null;

        workout.endDate = currentDate;
        return workout;
    }

    function isObservableSetting(settingName) {
        if ($.inArray(settingName, OBSERVABLE_SETTINGS) >= 0)
            return true;
        return false;
    }

    function initSetting(key) {
        var settingsFromStorage = localStorage.getItem("dxworkout-settings-" + key),
            currentSettings;
        if(settingsFromStorage) {
            currentSettings = JSON.parse(settingsFromStorage); 
        } else {
           currentSettings = wo.defaultSettings[key]; 
        }
        
        wo.settings[key] = isObservableSetting(key) ? ko.observable(currentSettings) : currentSettings;
    }

    function saveSetting(key, value) {
        if(!isObservableSetting(key))
            wo.settings[key] = value; 
        localStorage.setItem("dxworkout-settings-" + key, JSON.stringify(value));
    }

    function initUserData() {
        if(localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) {
            clearUserData();
            localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
        }
        initSetting("goal");
        initSetting("exercise");
        initSetting("lengthUnit");
        initSetting("weightUnit");

        var storageData = localStorage.getItem(WORKOUTS_KEY);
        var data = storageData ? JSON.parse(storageData) : wo.sampleData;
        workoutArray = wo.workouts = ko.observableArray(data);
    }

    function clearUserData() {
        var localStorageKeys = [
            WORKOUTS_KEY,
            CURRENT_KEY,
            DATA_VERSION,
            "dxworkout-settings-goal",
            "dxworkout-settings-exercise",
            "dxworkout-settings-lengthUnit",
            "dxworkout-settings-weightUnit"
        ];

        $.each(localStorageKeys, function () {
            localStorage.removeItem(this);
        });
    }

    $.extend(wo, {
        workouts: null,

        insertWorkout: insertWorkout,
        updateWorkout: updateWorkout,
        deleteWorkout: deleteWorkout,

        initUserData: initUserData,
        clearUserData: clearUserData,

        getWorkoutById: getWorkoutById,
        removeCurrentWorkout: removeCurrentWorkout,
        saveCurrentWorkout: saveCurrentWorkout,
        getCurrentFromStorage: getCurrentFromStorage,
        
        saveSettings: saveSetting,
        settings: {}
    });

    
}(jQuery, DevExpress, DXWorkout);