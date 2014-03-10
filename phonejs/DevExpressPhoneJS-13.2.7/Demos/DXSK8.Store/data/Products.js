window.DXSK8 = window.DXSK8 || {};
window.DXSK8.Store = window.DXSK8.Store || {};
window.DXSK8.Store.db = window.DXSK8.Store.db || {};

(function () {
    var db = {},
        TypeIds = {
            deck: "74C9F584-429F-4F5B-8A9F-007D6176D6E4",
            truck: "2D7D4288-E1D1-4116-AEEE-056EF87C011E",
            wheels: "3182DE2E-417D-4B1F-9E6D-1CB073DC5A04"
        }

    db.loadProduct = function(id, success, fail) {
        DXSK8.db.Products.load({
            select: [
                "ID",
                "Name",
                "Price",
                "Quantity",
                "ImageUrl",
                "Brand.Name"
            ],
            filter: ["ID", new DevExpress.data.Guid(id)]
        }).done(function (product) {
            product = mapProduct(product[0]);
            success.call(this, product);
        }).fail(fail);
    };

    db.loadProducts = function(type, success, fail) {
        DXSK8.db.Products.load({
            select: [
                "ID",
                "Name",
                "Price",
                "Quantity",
                "ImageUrl",
                "Brand.Name"
            ],
            filter: ["Type.ID", new DevExpress.data.Guid(TypeIds[type])]
        }).done(function (products) {
            products = $.map(products, mapProduct);
            DevExpress.data.query(products)
                .groupBy("brandName")
                .enumerate()
                .done(function (products) {
                    success.call(this, products);
                })

        }).fail(fail);
    };

    function mapProduct(product) {
        var result = {
            id: product.ID,
            image: DXSK8.db.getImage(product.ImageUrl),
            name: product.Name,
            price: parseFloat(product.Price),
            quantity: product.Quantity,
            brandName: product.Brand.Name
        }
        return result;
    }



    $.extend(DXSK8.Store.db, db);
})();