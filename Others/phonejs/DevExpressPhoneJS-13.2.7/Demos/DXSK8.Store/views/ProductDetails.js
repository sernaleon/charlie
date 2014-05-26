DXSK8.Store.ProductDetails = function(params) {
    var productType = params.type,
        productId = params.id,
        title = ko.observable("Loading..."),
        currentOrder = DXSK8.Store.Order,
        currentProduct = ko.observable(null);

    DXSK8.Store.db.loadProduct(productId, function(product) {
        currentProduct(product);
        title(product.name);
    });

    return {
        currentProduct: currentProduct,
        productType: productType,
        title: title,

        chooseProduct: function() {
            var currentItem = currentProduct();
            currentOrder[productType].model(currentItem);
            currentOrder.saveLocal();
            DXSK8.app.navigate("Cart", { root: true });
        }
    };
};