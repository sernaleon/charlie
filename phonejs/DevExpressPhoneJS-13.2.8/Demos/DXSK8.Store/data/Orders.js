window.DXSK8 = window.DXSK8 || {};
window.DXSK8.Store = window.DXSK8.Store || {};
window.DXSK8.Store.db = window.DXSK8.Store.db || {};

(function() {
    var CURRENT_ORDER_KEY = "cart-data";

    var db = {},
        endpointSelector = new DevExpress.EndpointSelector(DXSK8.config.endpoints),
        cachedCartDataString = localStorage.getItem(CURRENT_ORDER_KEY),
        cachedCartData = cachedCartDataString ? JSON.parse(cachedCartDataString) : {},
        currentOrder;
    
    currentOrder = {
        deck: new DXSK8.OrderItemViewModel("deck", cachedCartData.deck),
        truck: new DXSK8.OrderItemViewModel("truck", cachedCartData.truck),
        wheels: new DXSK8.OrderItemViewModel("wheels", cachedCartData.wheels),

        setEmptyValues: function () {
            this.deck.model(null);
            this.truck.model(null);
            this.wheels.model(null);
            localStorage.removeItem(CURRENT_ORDER_KEY);
        },

        getTotalPrice: function() {
            return (this.deck.model() ? this.deck.model().price : 0) +
                   (this.truck.model() ? this.truck.model().price : 0) +
                   (this.wheels.model() ? this.wheels.model().price : 0);
        },

        saveLocal: function () {
            var currentOrderInfo = {
                deck: this.deck.model(),
                truck: this.truck.model(),
                wheels: this.wheels.model()
            }

            $.each([currentOrderInfo.deck, currentOrderInfo.truck, currentOrderInfo.wheels], function(_, item) {
                if(item)
                    item.image = item.image.replace(endpointSelector.urlFor("storage"), "");
            });
           
            localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(currentOrderInfo));
        }
    }

    db.loadOrders = function (success, fail) {
        DXSK8.db.Orders.load({
            filter: ["Customer.ID", DXSK8.Store.User.id],
            select: [
                "ID",
                "OrderDate",
                "State",
                "OrderItems.Product.Name",
                "OrderItems.Product.Price",
                "OrderItems.Product.Type.Name"
            ],
            sort: [{ selector: "OrderDate", desc: true }]
        })
        .done(function(result) {
            result = $.map(result, mapOrder);
            success.call(this, result);
        })
        .fail(fail);
    };

    db.placeOrder = function (products, successHandler, errorHandler) {
        DXSK8.db.Orders.insert({
            "Customer": DXSK8.db.objectLink("Customers", DXSK8.Store.User.id),
            "OrderDate": new Date(),
            "State": 1,
        }).done(function (order, newId) {
            $.when(
                addOrderItem(newId, products[0].model() ? products[0].model().id : null),
                addOrderItem(newId, products[1].model() ? products[1].model().id : null),
                addOrderItem(newId, products[2].model() ? products[2].model().id : null)
            ).done(function () {
                currentOrder.setEmptyValues();
                successHandler();
            }).fail(function () {
                errorHandler();
            });
        });
    }

    function mapOrder(order) {
        var result = {
            id: order.ID,
            date: order.OrderDate,
            state: getOrderState(order.State),
            deck: mapOrderItem(order, "Decks"),
            truck: mapOrderItem(order, "Trucks"),
            wheel: mapOrderItem(order, "Wheels & Bearings")
        };

        result.title = result.deck.name + " + " + result.truck.name + " + " + result.wheel.name;
        result.price = result.deck.price + result.truck.price + result.wheel.price;
        return result;
    }

    function mapOrderItem(order, itemType) {
        var item = $.grep(order.OrderItems, function(item) { return item.Product.Type.Name == itemType })[0];
        return {
            name: item.Product.Name,
            price: parseFloat(item.Product.Price)
        };
    }

    function getOrderState(stateId) {
        switch(stateId) {
            case 4:
                return "out of stock";
            case 3:
                return "completed";
            default:
                return "in progress";
        }
    }

    function addOrderItem(orderId, productId) {
        if (!orderId || !productId)
            return null;

        var added = $.Deferred();
        DXSK8.db.OrderItems.insert({
            "Order": DXSK8.db.objectLink("Orders", new DevExpress.data.Guid(orderId)),
            "Product": DXSK8.db.objectLink("Products", new DevExpress.data.Guid(productId)),
        }).done(function () {
            added.resolve();
        }).fail(function () {
            added.reject();
        });

        return added;
    }

    DXSK8.Store.Order = currentOrder;
    $.extend(DXSK8.Store.db, db);
})();