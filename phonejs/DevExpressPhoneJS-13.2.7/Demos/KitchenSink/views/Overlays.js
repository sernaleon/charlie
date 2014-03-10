KitchenSink.Overlays = function (params) {
    var viewModel = {
        loadPanel: {
            visible: ko.observable(false),
            startLoading: function() {
                viewModel.loadPanel.visible(true);
                setTimeout(viewModel.loadPanel.finishLoading, 3000);
            },
            finishLoading: function() {
                viewModel.loadPanel.visible(false);
            }
        },
        popup: {
            visible: ko.observable(false),
            showPopup: function() {
                this.popup.visible(true);
            },
            hidePopup: function() {
                this.popup.visible(false);
            }
        },
        actionsheet: {
            visible: ko.observable(false),
            showActionSheet: function() {
                this.actionsheet.visible(true);
            },
            items: [
                {
                    text: "Delete",
                    clickAction: function() { alert("Delete"); },
                    type: "danger"
                },
                {
                    text: "Reply",
                    clickAction: function() { alert("Reply"); }
                },
                {
                    text: "Forward",
                    clickAction: function() { alert("Forward"); }
                },
                {
                    text: "Save Image",
                    clickAction: function() { alert("Save Image"); },
                    disabled: true
                }
            ]
        },
        toast: {
            toastInfoVisible: ko.observable(false),
            toastErrorVisible: ko.observable(false),
            toastSuccessVisible: ko.observable(false),
            toastWarningVisible: ko.observable(false),
            toastCustomVisible: ko.observable(false),

            showInfo: function() {
                this.toastInfoVisible(true);
            },
            showError: function() {
                this.toastErrorVisible(true);
            },
            showSuccess: function() {
                this.toastSuccessVisible(true);
            },
            showWarning: function() {
                this.toastWarningVisible(true);
            },
            showCustom: function() {
                this.toastCustomVisible(true);
            }
        },
        popover: {
            visible: ko.observable(false),
            toggle: function() {
                this.popover.visible(!this.popover.visible());
            },
            close: function() {
                this.popover.visible(false);
            },
            colors: ["Red", "Green", "Blue", "White", "Black"]
        },
        dialogs: {
            notify: function(){
                DevExpress.ui.notify("Sample message", "success", 1000);
            },
            alert: function() {
                DevExpress.ui.dialog.alert("Sample message", "Alert");
            },
            confirm: function() {
                DevExpress.ui.dialog.confirm("Sample message", "Confirm");
            },
            custom: {
                show: function() {
                    var replace = function() {
                        return "Replace";
                    };
                    var rename = function() {
                        return "Rename";
                    };
                    var customDialog = DevExpress.ui.dialog.custom({
                        title: "Item exists",
                        message: "<strong><em>The item already exists</em></strong>",
                        buttons: [
                            { text: "Replace", clickAction: replace },
                            { text: "Rename", clickAction: rename }
                        ]
                    });
                    customDialog.show().done(function(dialogResult) {
                        DevExpress.ui.notify(dialogResult, "info", 1000);
                    });
                }
            }
        }
    };
    return viewModel;
};