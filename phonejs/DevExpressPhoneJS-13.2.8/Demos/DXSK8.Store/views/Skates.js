DXSK8.Store.Skates = function(params) {
    var currentOrder = DXSK8.Store.Order;

    var viewModel = {
        skates: DXSK8.Store.db.loadSkates(),
        selectSkate: function(params) {
            var skate = params.itemData;
            currentOrder.deck.model(skate.deck);
            currentOrder.truck.model(skate.truck);
            currentOrder.wheels.model(skate.wheel);
            currentOrder.saveLocal();
            DXSK8.app.back();
        },

        chooseSkate: function() {
            currentOrder.deck.model(deck.model());
            currentOrder.truck.model(truck.model());
            currentOrder.wheels.model(wheels.model());
            currentOrder.saveLocal();
            DXSK8.app.back();
        }
    };

    return viewModel;
};