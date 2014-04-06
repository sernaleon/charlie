KitchenSink.Navigation = function(params) {
    var viewModel = {
        navbar: {
            currentImageClass: ko.observable("content-icon-home"),
            itemClickAction: function(e) {
                this.navbar.currentImageClass(e.itemData.imageClass);
            },
            items: [
                { text: "Home", icon: "home", imageClass: "content-icon-home" },
                { text: "User", icon: "user", imageClass: "content-icon-user" },
                { text: "Comment", icon: "comment", imageClass: "content-icon-message" },
                { text: "Photo", icon: "photo", imageClass: "content-icon-image" }
            ],
            selectedIndex: ko.observable(0)
        }
    };
    return viewModel;
};