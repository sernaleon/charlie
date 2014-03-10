DXSK8.Store.Orders = function(params) {
    var orders = ko.observableArray();

    return {
        orders: orders,

        viewShowing: function() {
            DXSK8.Store.db.loadOrders(function(result) {
                orders(result);
            }, function(error) {
                DevExpress.ui.notify("We cannot show your orders now. Please check your internet connection and try later.");
            });
        }
    };
};