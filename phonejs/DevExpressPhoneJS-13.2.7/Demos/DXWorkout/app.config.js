window.DXWorkout = $.extend(true, window.DXWorkout, {
    "config": {
        "navigationType": "slideout",
        "navigation": [
            {
                "id": "Home",
                "title": "Home",
                "action": "#Home",
                "icon": "home",
                "location": "navigation"
            },
            {
                "id": "Logs",
                "title": "Logs",
                "action": "#Log",
                "icon": "event",
                "location": "navigation"
            },
            {
                "id": "Graphs",
                "title": "Graphs",
                "action": "#GoalGraphs",
                "icon": "chart",
                "location": "navigation"
            },
            {
                "id": "Settings",
                "title": "Settings",
                "action": "#Settings",
                "icon": "card",
                "location": "navigation"
            }
        ]
    }
});
