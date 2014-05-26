window.KitchenSink = $.extend(true, window.KitchenSink, {
  "config": {
    "navigationType": "slideout",
    "commandMapping": {
      "ios-header-toolbar": {
        "commands": [
          {
            "id": "menu-add",
            "location": "menu"
          },
          {
              "id": "menu-edit",
              "location": "menu"
          },
          {
              "id": "menu-remove",
              "location": "menu"
          }
        ]
      },
      "android-header-toolbar": {
        "commands": [
          {
              "id": "menu-add",
              "location": "menu"
          },
          {
              "id": "menu-edit",
              "location": "menu"
          },
          {
              "id": "menu-remove",
              "location": "menu"
          }
        ]
      },
      "win8-phone-appbar": {
        "commands": [
          {
              "id": "menu-add",
              "location": "menu"
          },
          {
              "id": "menu-edit",
              "location": "menu"
          },
          {
              "id": "menu-remove",
              "location": "menu"
          }
        ]
      },
      "tizen-header-toolbar": {
        "commands": [
          {
              "id": "menu-add",
              "location": "menu"
          },
          {
              "id": "menu-edit",
              "location": "menu"
          },
          {
              "id": "menu-remove",
              "location": "menu"
          }
        ]
      },
      "generic-header-toolbar": {
          "commands": [
            {
                "id": "menu-add",
                "location": "menu"
            },
            {
                "id": "menu-edit",
                "location": "menu"
            },
            {
                "id": "menu-remove",
                "location": "menu"
            }
          ]
      }
    },

    "navigation": [
      {
        "title": "Form",
        "action": "#Form",
        "icon": "todo"
      },
      {
        "title": "Overlays",
        "action": "#Overlays",
        "icon": "tips"
      },
      {
        "title": "Lists",
        "action": "#Lists",
        "icon": "card"
      },
      {
        "title": "Maps",
        "action": "#Maps",
        "icon": "map"
      },
      {
        "title": "Gallery",
        "action": "#Gallery",
        "icon": "photo"
      },
      {
        "title": "Navigation",
        "action": "#Navigation",
        "icon": "arrowright"
      },
      {
        "title": "Custom Events",
        "action": "#CustomEvents",
        "icon": "events"
      },
      {
        "title": "Icons",
        "action": "#IconSet",
        "icon": "image"
      }
    ]
  }
});