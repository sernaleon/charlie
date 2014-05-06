DXSK8.Store.Home = function(params) {
    var currentOrder = DXSK8.Store.Order,
        cartItemsCount = ko.observable(),
        cartCost = ko.observable(),
        userName = DXSK8.Store.User.name,
        userPhoto = DXSK8.Store.User.photo,
        userAddress,

        orderCount = ko.observable(),
        orders = ko.observableArray();

    function cartHandler() {
        DXSK8.app.navigate("Cart", { root: true });
    }

    function updateOrders() {
        DXSK8.Store.db.loadOrders(function(result) {
            orderCount(result.length);
            orders(result);
        });
    }

    function getItemsCount() {
        return (currentOrder.deck.model() ? 1 : 0) +
                (currentOrder.truck.model() ? 1 : 0) +
                (currentOrder.wheels.model() ? 1 : 0);
    }

    userAddress = ko.computed(function () {
        return DXSK8.Store.User.shippingAddress.city() + ", " + DXSK8.Store.User.shippingAddress.state();
    })

    return {
        cartItemsCount: cartItemsCount,
        cartCost: cartCost,
        userName: userName,
        userPhoto: userPhoto,
        userAddress: userAddress,

        orderCount: orderCount,
        orders: orders,

        cartHandler: cartHandler,

        viewShowing: function() {
            cartItemsCount(getItemsCount());
            cartCost(currentOrder.getTotalPrice());
            updateOrders();
        },

        viewShown: function() {
            if (DevExpress.devices.current().screenSize === "small")
                $(".dx-viewport .home-view").dxScrollView();
        }
    };
};