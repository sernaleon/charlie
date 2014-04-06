"use strict";

DXWorkout.WeightGraphs = function(params) {
    var weightChartDataSource = ko.observableArray([]),
        exerciseTypes = ko.observableArray([]),
        tabOptions,
        chartOptions,
        selectedTab = ko.observable(1),
        selectedExerciseType = ko.observable(""),
        isWeightDataLoaded = ko.observable(false);   

    function setTypes(workouts) {
        var exercisesArray = [];
        $.each(workouts, function() {
            $.each(this.exercises, function() {
                var name = this.name;
                $.each(this.sets, function() {
                    if(name && this.weight && $.inArray(name, exercisesArray) < 0) {
                        exercisesArray.push(name);
                        return false;
                    }
                });
            });
        });

        exerciseTypes(exercisesArray);
        selectedExerciseType(exercisesArray.length ? exercisesArray[0] : null);
        weightDataLoaded(workouts);
    }

    function weightDataLoaded(workouts) {
        var weightGraphObj = { },
            weightGraphInfo = [ ];

        $.each(workouts, function (_, workout) {
            return $.each(workout.exercises, function (_, exercise) {
                if (exercise.name === selectedExerciseType()) {
                    var maxWeight = -1;
                    $.each(exercise.sets, function () {
                        if (this.weight > maxWeight)
                            maxWeight = this.weight;
                    });
                    if (maxWeight > 0) {
                        var date = new Date(workout.startDate);
                        var key = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                        if (weightGraphObj[key] > maxWeight)
                            return;

                        weightGraphObj[key] = maxWeight;
                    }
                }
            });
        });

        weightGraphInfo = $.map(weightGraphObj, function(value, key) {
            return {
                date: new Date(key),
                weight: value
            }
        });

        if (weightGraphInfo.length)
                weightChartDataSource(weightGraphInfo);
            else
                weightChartDataSource([]);
        isWeightDataLoaded(true);
    }

    selectedExerciseType.subscribe(function() {
        weightDataLoaded(DXWorkout.workouts());
    });

    tabOptions = {
        items: [
            { text: "Goal" },
            { text: "Weight" }
        ],
        itemClickAction: function(value) {
            if (value.itemData.text === "Goal")
                DXWorkout.app.navigate("GoalGraphs", { root: "true" });
        },
        selectedIndex: selectedTab
    };

    chartOptions = {
        commonSeriesSettings: {
            argumentField: 'date'
        },
        series: [
            { valueField: 'weight', name: 'Weight' },
        ],
        argumentAxis: {
            grid: {
                visible: true
            },
            tickInterval: 'day',
            label: {
                format: 'monthAndDay',
                overlappingBehavior: {
                    mode: 'enlargeTickInterval'
                }
            }
        },
        valueAxis: {
            min: 0
        },
        tooltip: {
            enabled: true,
            argumentFormat: 'shortDate',
            customizeText: function() {
                return this.seriesName + ': ' + this.valueText + '<br/>' + this.argumentText;
            }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center'
        },
        dataSource: weightChartDataSource
    };

    return {
        currentNavigationItemId: "Graphs",
        chartOptions: chartOptions,

        exerciseTypes: exerciseTypes,
        selectedExerciseType: selectedExerciseType,
        isWeightDataLoaded: isWeightDataLoaded,

        tabOptions: tabOptions,

        viewShowing: function() {
            isWeightDataLoaded(false);
            selectedTab(1);
        },

        viewShown: function() {
            var workouts = DXWorkout.workouts();
            setTypes(workouts);
        },

        weightChartHasData: function() {
            return weightChartDataSource().length;
        }
    };
};