KitchenSink.Form = function(params) {
    var viewModel = {
        dxAutocomplete: {
            text: ko.observable(""),
            cities: KitchenSink.db.cities
        },
        dxSwitch: {
            value: ko.observable(true)
        },
        dxSlider: {
            value: ko.observable(5)
        },
        dxRangeSlider: {
            minValue: ko.observable(3),
            maxValue: ko.observable(7)
        },
        dxLookup: {
            data: ["red", "green", "blue", "yellow"],
            value: ko.observable(null)
        },
        dxSelectbox: {
            data: ["light", "dark"],
            value: ko.observable(null)
        },
        dxCheckbox: {
            checked: ko.observable(false)
        },
        dxRadioGroup: {
            items: [
                { text: "Tea" },
                { text: "Coffee" },
                { text: "Juice" }
            ]
        }
    };

    return viewModel;
};