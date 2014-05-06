DXSK8.Store.Profile = function(params) {
    var isPhone = DevExpress.devices.current().screenSize === "small";

    return {
        user: DXSK8.Store.User,
        isPhone: isPhone,

        showLookup: function (e) {
            if(isPhone)
                return;
            $(".dx-viewport .dx-lookup-popup-wrapper:visible").addClass(e.element.closest(".billing").length ? "billing-popup" : "shipping-popup");
        },

        viewShown: function() {
            if(isPhone)
                $(".dx-viewport .profile").dxScrollView();
            else
                $(".dx-viewport .profile-address-info").dxScrollView();
        }
    };
};