DXSK8.Store.SelectProduct = function(params) {
    var currentProduct = ko.observable(null),
        currentOrder = DXSK8.Store.Order,
        productType = params.type,
        productId = params.id,
        currentProductModel,
        title = "Select " + productType,
        loadPanelVisible = ko.observable(false),
        products = new DevExpress.data.DataSource({
            load: function () {
                var resultProducts = new $.Deferred();
                DXSK8.Store.db.loadProducts(productType, function (result) {
                    setCurrentProduct(result);
                    resultProducts.resolve(result);
                }, function () {
                    DevExpress.ui.notify("We cannot load product list now. Please check your internet connection and try later.");
                    resultProducts.reject();
                });

                return resultProducts.promise();
            }
        });
        
    function showProduct(data) {
        currentProduct(data.itemData);
    }

    function chooseProduct() {
        var currentItem = currentProduct();

        currentOrder[productType].model(currentItem);
        currentOrder.saveLocal();
        DXSK8.app.back();
    }

    function setCurrentProduct(products) {
        var current = currentProduct(),
            id = productId;

        if(id) {
            $.each(products, function (_, productGroup) {
                $.each(productGroup.items, function(_, product) {
                    if(product.id === id) {
                        current = product;
                    }
                });
            });
        } else if(!current) {
            current = products[0].items[0];
        }

        currentProduct(current);
    }

    return {
        products: products,
        title: title,
        currentProduct: currentProduct,
        productType: productType,
        loadPanelVisible: loadPanelVisible,

        chooseProduct: chooseProduct,
        showProduct: showProduct,
    };
};