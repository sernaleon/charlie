DXWorkout.List = function (params) {
    var action = params.action,
        key = params.item,
        wo = DXWorkout,
        searchQuery = ko.observable(""),
        title,
        titleBag = [],
        newValue = ko.observable(""),
        keySettings = ko.observableArray(),
        emptyValue = "Enter new " + key + "...",
        isEdit = action === "edit",
        canDelete,
        deleteMode,
        addButtonDisabled;

    switch (DevExpress.devices.current().platform) {
        case 'ios':
            deleteMode = 'slideButton';
            break; 
        case 'win8':
            deleteMode = 'hold';
            break;
        default:
            deleteMode = 'swipe';
    }


    titleBag = [
        isEdit ? "Edit" : "Select", " ",
        capitalize(key),
        isEdit ? "s" : ""
    ];
    title = titleBag.join("");

    function capitalize(text) {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

    function showToast(message) {
        var device = DevExpress.devices.current();
        var toastSettings = {
            message: message,
            displayTime: 5000
        };

        DevExpress.ui.notify(toastSettings);
    }

    function handleDeleteClick(e) {
        var message = "\"" + e.itemData + "\" was deleted";
        DXWorkout.saveSettings(key, keySettings());

        showToast(message);
    }

    function handleAddClick() {
        var added = false,
            formattedNewValue = $.trim(newValue());
        newValue("");
        if(formattedNewValue) {
            var message = "\"" + formattedNewValue + "\" was added";
            $.each(keySettings(), function(key, value) {
                if(value.toLowerCase() === formattedNewValue.toLowerCase()) {
                    added = true;
                    return false;
                }
            });
            if(!added) {
                keySettings.push(formattedNewValue);
                keySettings.sort();
            }

            DXWorkout.saveSettings(key, keySettings());
            showToast(message);
        }
    }

    function handleItemClick(e) {
        var workout = wo.currentWorkout;
        if(!isEdit) {
            switch(key) {
                case "goal":
                    workout.goal(e.itemData);
                    workout.handleAddExercise();
                    break;
                case "exercise":
                    workout.currentExercise().name(e.itemData);
                    wo.app.navigate("Exercise/add");
                    break;
            }
        }
    };

    function handleCancel() {
        var workout = wo.currentWorkout;
        if(isEdit) {
            wo.app.back();
        } else {
            switch(key) {
                case "goal":
                    workout.cancelCurrentWorkout();
                    break;
                case "exercise":
                    workout.exercises.pop();
                    wo.app.back();
                    break;
            }
        }
    };

    searchQuery.subscribe(function(value) {
        var result = $.grep(wo.settings[key], function(product, index) {
            var regExp = new RegExp(value, "i");
            return !!product.match(regExp);
        });
        keySettings(result);
    });

    canDelete = ko.computed(function() {
        return isEdit && keySettings().length > 1;
    });

    addButtonDisabled = ko.computed(function() {
        return newValue().length === 0;
    });

    return {
        hideNavigationButton: !isEdit,
        isEdit: isEdit,
        canDelete: canDelete,
        addButtonDisabled: addButtonDisabled,
        deleteMode: deleteMode,

        keySettings: keySettings,
        title: title,
        newValue: newValue,
        emptyValue: emptyValue,
        searchQuery: searchQuery,

        handleDeleteClick: handleDeleteClick,
        handleAddClick: handleAddClick,
        handleItemClick: handleItemClick,
        handleCancel: handleCancel,

        viewShowing: function(args) {
            keySettings(wo.settings[key]);
            searchQuery("");
            newValue("");
        },

        viewShown: function () {
            $(".dx-active-view .dx-scrollable").data("dxScrollView").scrollTo(0);
            if(!isEdit && key === "exercise") 
                wo.currentWorkout.clearCurrentExercise();
        },

        backButtonDown: handleCancel
    };
};