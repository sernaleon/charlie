// Sample data for the demo
"use strict";

!function($, DX, wo, undefined) {
    var today = new Date(),
        DAY_TIMESPAN = 86400000,
        MINUTE_TIMESPAN = 60000;        

    wo.sampleData = [
        {
            "startDate": new Date(today - 15 * DAY_TIMESPAN),
            "endDate": new Date(today - 15 * DAY_TIMESPAN + 60 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Bench press",
                    "sets": [
                        {
                            "reps": 12,
                            "weight": 80
                        },
                        {
                            "reps": 10,
                            "weight": 130
                        },
                        {
                            "reps": 8,
                            "weight": 165
                        },
                        {
                            "reps": 8,
                            "weight": 175
                        }
                    ]
                },
                {
                    "name": "Chest fly",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 15
                    },
                    {
                        "reps": 10,
                        "weight": 20
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 6,
                        "weight": 35
                    }
                    ]
                }
            ],
            "goal": "Flexibility",
            "id": "9fb81949-10d3-4348-d9ef-cdcb3a24c8d109",
            "notes": ""
        },
        {
            "startDate": new Date(today - 18 * DAY_TIMESPAN),
            "endDate": new Date(today - 18 * DAY_TIMESPAN + 75 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Deadlift",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 100
                    },
                    {
                        "reps": 10,
                        "weight": 170
                    },
                    {
                        "reps": 8,
                        "weight": 250
                    },
                    {
                        "reps": 5,
                        "weight": 280
                    }
                    ]
                },
                {
                    "name": "Bent-over row",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 30
                    },
                    {
                        "reps": 10,
                        "weight": 40
                    },
                    {
                        "reps": 10,
                        "weight": 40
                    },
                    {
                        "reps": 8,
                        "weight": 50
                    }
                    ]
                }
            ],
            "goal": "Cardiovascular",
            "id": "1c13feae-a7e8-8d35-6aa2-93a108bfd4684",
            "notes": ""
        },
        {
            "startDate": new Date(today - 23 * DAY_TIMESPAN),
            "endDate": new Date(today - 23 * DAY_TIMESPAN + 45 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Squat",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 140
                    },
                    {
                        "reps": 8,
                        "weight": 200
                    },
                    {
                        "reps": 6,
                        "weight": 260
                    }
                    ]
                },
                {
                    "name": "Calf raise",
                    "sets": [
                    {
                        "reps": 45,
                        "weight": 32
                    },
                    {
                        "reps": 45,
                        "weight": 32
                    },
                    {
                        "reps": 45,
                        "weight": 32
                    },
                    {
                        "reps": 45,
                        "weight": 32
                    }
                    ]
                },
                {
                    "name": "Lunge",
                    "sets": [
                    {
                        "reps": 16,
                        "weight": 40
                    },
                    {
                        "reps": 14,
                        "weight": 80
                    },
                    {
                        "reps": 14,
                        "weight": 90
                    },
                    {
                        "reps": 14,
                        "weight": 100
                    },
                    {
                        "reps": 14,
                        "weight": 110
                    }
                    ]
                }
            ],
            "goal": "Muscular Strength",
            "id": "ff106c65-6df2-65b2-1e96-236d33d58fc86",
            "notes": ""
        },
        {
            "startDate": new Date(today - 25 * DAY_TIMESPAN),
            "endDate": new Date(today - 25 * DAY_TIMESPAN + 115 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Bench press",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 130
                    },
                    {
                        "reps": 8,
                        "weight": 165
                    },
                    {
                        "reps": 8,
                        "weight": 165
                    },
                    {
                        "reps": 8,
                        "weight": 165
                    }
                    ]
                },
                {
                    "name": "Chest fly",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 15
                    },
                    {
                        "reps": 10,
                        "weight": 20
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 6,
                        "weight": 35
                    }
                    ]
                }
            ],
            "goal": "Cardiovascular",
            "id": "91952bf4-8221-01f8-ec81-0539c669e510b6f",
            "notes": ""
        },
        {
            "startDate": new Date(today - 28 * DAY_TIMESPAN),
            "endDate": new Date(today - 28 * DAY_TIMESPAN + 70 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Deadlift",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 100
                    },
                    {
                        "reps": 10,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 240
                    },
                    {
                        "reps": 6,
                        "weight": 260
                    }
                    ]
                },
                {
                    "name": "Bent-over row",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 30
                    },
                    {
                        "reps": 10,
                        "weight": 40
                    },
                    {
                        "reps": 8,
                        "weight": 45
                    },
                    {
                        "reps": 8,
                        "weight": 50
                    }
                    ]
                }
            ],
            "goal": "Flexibility",
            "id": "14f8a584-c232-7e22-badc-44af7eb350fa",
            "notes": ""
        },
        {
            "startDate": new Date(today - 30 * DAY_TIMESPAN),
            "endDate": new Date(today - 30 * DAY_TIMESPAN + 50 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Squat",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 140
                    },
                    {
                        "reps": 8,
                        "weight": 200
                    },
                    {
                        "reps": 6,
                        "weight": 250
                    }
                    ]
                },
                {
                    "name": "Calf raise",
                    "sets": [
                    {
                        "reps": 40,
                        "weight": 32
                    },
                    {
                        "reps": 40,
                        "weight": 32
                    },
                    {
                        "reps": 40,
                        "weight": 32
                    },
                    {
                        "reps": 40,
                        "weight": 32
                    }
                    ]
                },
                {
                    "name": "Lunge",
                    "sets": [
                    {
                        "reps": 16,
                        "weight": 40
                    },
                    {
                        "reps": 14,
                        "weight": 80
                    },
                    {
                        "reps": 14,
                        "weight": 90
                    },
                    {
                        "reps": 14,
                        "weight": 100
                    },
                    {
                        "reps": 14,
                        "weight": 110
                    }
                    ]
                }
            ],
            "goal": "Muscular Strength",
            "id": "155575d2-d110-6425-cfce-5262ad8ab43be",
            "notes": ""
        },
        {
            "startDate": new Date(today - 32 * DAY_TIMESPAN),
            "endDate": new Date(today - 32 * DAY_TIMESPAN + 85 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Bench press",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 120
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    }
                    ]
                },
                {
                    "name": "Chest fly",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 15
                    },
                    {
                        "reps": 10,
                        "weight": 20
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    }
                    ]
                }
            ],
            "goal": "Muscular Strength",
            "id": "427afac4-166b-3d19-4b40-32c6c3b6639f",
            "notes": ""
        },
        {
            "startDate": new Date(today - 35 * DAY_TIMESPAN),
            "endDate": new Date(today - 35 * DAY_TIMESPAN + 60 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Deadlift",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 100
                    },
                    {
                        "reps": 10,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 220
                    },
                    {
                        "reps": 6,
                        "weight": 260
                    }
                    ]
                },
                {
                    "name": "Bent-over row",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 30
                    },
                    {
                        "reps": 10,
                        "weight": 40
                    },
                    {
                        "reps": 8,
                        "weight": 55
                    }
                    ]
                }
            ],
            "goal": "Flexibility",
            "id": "b3d3c867-9105-36a9-fa34-7138be9a08d86",
            "notes": ""
        },
        {
            "startDate": new Date(today - 37 * DAY_TIMESPAN),
            "endDate": new Date(today - 37 * DAY_TIMESPAN + 75 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Squat",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 140
                    },
                    {
                        "reps": 8,
                        "weight": 200
                    },
                    {
                        "reps": 6,
                        "weight": 240
                    }
                    ]
                },
                {
                    "name": "Calf raise",
                    "sets": [
                    {
                        "reps": 40,
                        "weight": 30
                    },
                    {
                        "reps": 40,
                        "weight": 30
                    },
                    {
                        "reps": 40,
                        "weight": 30
                    },
                    {
                        "reps": 40,
                        "weight": 30
                    }
                    ]
                },
                {
                    "name": "Lunge",
                    "sets": [
                    {
                        "reps": 16,
                        "weight": 40
                    },
                    {
                        "reps": 14,
                        "weight": 80
                    },
                    {
                        "reps": 14,
                        "weight": 100
                    },
                    {
                        "reps": 14,
                        "weight": 100
                    },
                    {
                        "reps": 14,
                        "weight": 100
                    }
                    ]
                }
            ],
            "goal": "Muscular Strength",
            "id": "cbbfb4ae-8652-1835-110a-4d4b2cbe3c587",
            "notes": ""
        },
        {
            "startDate": new Date(today - 41 * DAY_TIMESPAN),
            "endDate": new Date(today - 41 * DAY_TIMESPAN + 65 * MINUTE_TIMESPAN),
            "exercises": [
                {
                    "name": "Bench press",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 80
                    },
                    {
                        "reps": 10,
                        "weight": 120
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    },
                    {
                        "reps": 8,
                        "weight": 160
                    }
                    ]
                },
                {
                    "name": "Chest fly",
                    "sets": [
                    {
                        "reps": 12,
                        "weight": 15
                    },
                    {
                        "reps": 10,
                        "weight": 20
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    },
                    {
                        "reps": 8,
                        "weight": 25
                    }
                    ]
                }
            ],
            "goal": "Losing Fat",
            "id": "495eeaa0-5d33-7260-e486-d99fe2c04876",
            "notes": ""
        }
    ];

    $.each(wo.sampleData, function() {
        this.caption = Globalize.format(this.startDate, "MMM d, yyyy") 
            + " - " 
            + this.goal 
            + " (" + wo.formatTime((this.endDate - this.startDate) / MINUTE_TIMESPAN) + ")";
    });

}(jQuery, DevExpress, DXWorkout);