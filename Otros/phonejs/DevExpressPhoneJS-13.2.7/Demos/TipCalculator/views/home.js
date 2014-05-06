"use strict";

TipCalculator.home = function(params) {
    var DEFAULT_TIP_PERCENT = 15;

    var billTotal = ko.observable(),
        tipPercent = ko.observable(DEFAULT_TIP_PERCENT),
        splitNum = ko.observable(1);

    var ROUND_UP = 1,
        ROUND_DOWN = -1,
        ROUND_NONE = 0,
        roundMode = ko.observable(ROUND_NONE);

    function billTotalAsNumber() {
        return billTotal() || 0;
    }


    var totalTip = ko.computed(function() {
        return 0.01 * tipPercent() * billTotalAsNumber();
    });

    var tipPerPerson = ko.computed(function() {
        return totalTip() / splitNum();
    });

    var totalPerPerson = ko.computed(function() {
        return (totalTip() + billTotalAsNumber()) / splitNum();
    });

    var totalToPay = ko.computed(function() {
        var value = totalTip() + billTotalAsNumber();

        switch(roundMode()) {
            case ROUND_DOWN:
                if(Math.floor(value) >= billTotalAsNumber())
                    return Math.floor(value);
                return value;

            case ROUND_UP:
                return Math.ceil(value);

            default:
                return value;
        }
    });


    function roundUp() {
        roundMode(ROUND_UP);
    }

    function roundDown() {
        roundMode(ROUND_DOWN);
    }


    billTotal.subscribe(function() {
        roundMode(ROUND_NONE);
    });

    tipPercent.subscribe(function() {
        roundMode(ROUND_NONE);
    });

    splitNum.subscribe(function() {
        roundMode(ROUND_NONE);
    });


    function viewShown() {
        $("#billTotalInput").data("dxNumberBox").focus();
    }


    return {
        billTotal: billTotal,
        tipPercent: tipPercent,
        splitNum: splitNum,

        totalTip: totalTip,
        tipPerPerson: tipPerPerson,
        totalPerPerson: totalPerPerson,
        totalToPay: totalToPay,

        roundUp: roundUp,
        roundDown: roundDown,

        viewShown: viewShown
    };
};