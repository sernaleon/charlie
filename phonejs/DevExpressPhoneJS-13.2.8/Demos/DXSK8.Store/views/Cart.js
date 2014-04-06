DXSK8.Store.Cart = function(params) {
    var currentOrder = DXSK8.Store.Order,
        deck = currentOrder.deck,
        truck = currentOrder.truck,
        wheels = currentOrder.wheels,
        processing = false,
        totalPrice;

    totalPrice = ko.computed(function() {
        return currentOrder.getTotalPrice();
    });

    var viewModel = {
        deck: deck,
        truck: truck,
        wheels: wheels,
        totalPrice: totalPrice,
        skates: DXSK8.Store.db.loadSkates(),

        processOrder: function() {
            if(processing)
                return;

            processing = true;
            if (deck.isEmpty() || truck.isEmpty() || wheels.isEmpty()) {
                DevExpress.ui.dialog.alert("Your order is not complete. Please select a deck, a truck and wheels, or choose a standard skateboard model.");
                processing = false;
                return;
            }

            DXSK8.Store.db.placeOrder([deck, truck, wheels], function() {
                DevExpress.ui.dialog.alert({
                    message: "Your order is accepted. Track the status of your orders using the Orders tab.",
                    buttons: [
                        {
                            text: "Ok",
                            clickAction: function() {
                                setTimeout(function() {
                                    DXSK8.app.navigate("Orders", { root: true });
                                }, 500);
                                return true;
                            }
                        }
                    ]
                });
                processing = false;
            }, function() {
                processing = false;
            });
        },

        clearItem: function(args) {
            var item = args.model;
            item.clearItem();
            currentOrder.saveLocal();
        },

        selectSkate: function(params) {
            var skate = params.itemData;
            deck.model(skate.deck);
            truck.model(skate.truck);
            wheels.model(skate.wheel);
            currentOrder.saveLocal();
        },

        viewShown: function() {
            if (DevExpress.devices.current().screenSize === "small")
                $(".dx-viewport .cart-content").dxScrollView();
        }
    };

    return viewModel;
};