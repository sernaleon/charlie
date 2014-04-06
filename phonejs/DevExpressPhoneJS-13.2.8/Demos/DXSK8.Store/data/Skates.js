window.DXSK8 = window.DXSK8 || {};
window.DXSK8.Store = window.DXSK8.Store || {};
window.DXSK8.Store.db = window.DXSK8.Store.db || {};

(function() {
    var db = {};

    db.loadSkates = function() {
        return new DevExpress.data.DataSource ({
            store: DXSK8.db.Skates,
            select: [
                "ID",
                "ImageUrl",
                "Deck.ID",
                "Deck.Name",
                "Deck.Price",
                "Deck.Quantity",
                "Deck.ImageUrl",
                "Truck.ID",
                "Truck.Name",
                "Truck.Price",
                "Truck.Quantity",
                "Truck.ImageUrl",
                "Wheel.ID",
                "Wheel.Name",
                "Wheel.Price",
                "Wheel.Quantity",
                "Wheel.ImageUrl"
            ],
            map: mapSkate
        });
    };

    function mapSkate(skate) {
        var result = {
            id: skate.ID,
            image: DXSK8.db.getImage(skate.ImageUrl),
            deck: {
                id: skate.Deck.ID,
                name: skate.Deck.Name,
                price: parseFloat(skate.Deck.Price),
                quantity: skate.Deck.Quantity,
                image: DXSK8.db.getImage(skate.Deck.ImageUrl)
            },
            truck: {
                id: skate.Truck.ID,
                name: skate.Truck.Name,
                price: parseFloat(skate.Truck.Price),
                quantity: skate.Truck.Quantity,
                image: DXSK8.db.getImage(skate.Truck.ImageUrl)
            },
            wheel: {
                id: skate.Wheel.ID,
                name: skate.Wheel.Name,
                price: parseFloat(skate.Wheel.Price),
                quantity: skate.Wheel.Quantity,
                image: DXSK8.db.getImage(skate.Wheel.ImageUrl)
            }
        };

        result.title = result.deck.name + " + " + result.truck.name + " + " + result.wheel.name;
        result.price = result.deck.price + result.truck.price + result.wheel.price;

        return result;
    }

    $.extend(DXSK8.Store.db, db);
})();