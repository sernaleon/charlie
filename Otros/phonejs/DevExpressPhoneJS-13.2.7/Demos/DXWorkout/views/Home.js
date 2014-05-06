"use strict";

DXWorkout.Home = function(params) {
    var EMPTY_TEXT = "none",
        wo = DXWorkout,
        currentDate = new Date,
        lastWorkoutDate = ko.observable(EMPTY_TEXT),
        daysFromLastWorkout = ko.observable(EMPTY_TEXT),
        chartDataSource = ko.observableArray([]),
        chartOptions,
        hasWorkouts;

    chartOptions = {
            series: {
                argumentField: 'startDate',
                valueField: 'duration',
            },
            title: {
                visible: false,
                font: {
                    size: 18
                }
            },
            legend: {
                visible: false
            },
            argumentAxis: {
                label: {
                    format: 'monthAndDay',
                    overlappingBehavior: {
                        mode: 'enlargeTickInterval'
                    }
                },
                grid: {
                    visible: true
                },
                tickInterval: 'day'
            },
            valueAxis: {
                min: 0,
                tickInterval: 'hours',
                label: {
                    customizeText: function(data) {
                        return wo.formatTime(data.value);
                    }
                }
            },
            tooltip: {
                enabled: true,
                customizeText: function() {
                    return wo.formatTime(this.value);
                }
            },
            palette: 'Soft Pastel',
            dataSource: chartDataSource
        };


    function lastMonthWorkouts(workouts) {
        var lastMonthDate = new Date(currentDate.getFullYear(), (currentDate.getMonth() - 1), currentDate.getDate());
        return $.map(workouts, function(item) {
            var startDate = new Date(item.startDate),
                endDate = new Date(item.endDate);
            if(startDate > lastMonthDate)
                return {
                    startDate: startDate,
                    duration: Math.ceil((endDate - startDate) / (60*1000))
                }
        });
    }  

    function updateChartDataSource(workouts) {
        var workouts = lastMonthWorkouts(workouts);
        if(workouts)
            chartDataSource(workouts);
    };

    function handleAddWorkout() {
        var workout = wo.createWorkoutViewModel();
        workout.clear();
        wo.currentWorkout = workout;
        wo.app.navigate("List/select/goal");
    }

    hasWorkouts = ko.computed(function() {
        return chartDataSource().length;
    })

    return {
        lastWorkoutDate: lastWorkoutDate,
        daysFromLastWorkout: daysFromLastWorkout,
        chartOptions: chartOptions,
        hasWorkouts: hasWorkouts,

        handleAddWorkout: handleAddWorkout,

        viewShowing: function() {
            var workouts = DXWorkout.workouts();
            currentDate = new Date;
            if(!workouts || !workouts.length) {
                chartDataSource([]);
                daysFromLastWorkout(EMPTY_TEXT);
                lastWorkoutDate(EMPTY_TEXT);
                return;
            }
            updateChartDataSource(workouts);

            workouts.sort(function(i, j) {
                return new Date(j.startDate) - new Date(i.startDate);
            });
            
            var lastDate = new Date(workouts[0].startDate);
            lastWorkoutDate(Globalize.format(lastDate, 'MMM d, yyyy'));
            daysFromLastWorkout(Math.floor((currentDate - lastDate) / (24*60*60*1000)));
        }
    };
};