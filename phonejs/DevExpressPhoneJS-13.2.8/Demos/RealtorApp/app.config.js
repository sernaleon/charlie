window.RealtorApp = $.extend(true, window.RealtorApp, {
  "config": {
    "navigationType": "navbar",
    "commandMapping": {
      "generic-header-toolbar": {
        "defaults": {
          "showIcon": "true",
          "showText": "false",
          "align": "right"
        },
        "commands": [
          "list",
          "map",
          "gallery"
        ]
      }
    },
    "navigation": [
      {
        "title": "Search",
        "action": "#Home",
        "icon": "home"
      },
      {
        "title": "Favorites",
        "action": "#Favorites",
        "icon": "favorites"
      },
      {
        "title": "About",
        "action": "#About",
        "icon": "info"
      }      
    ]
  }
});