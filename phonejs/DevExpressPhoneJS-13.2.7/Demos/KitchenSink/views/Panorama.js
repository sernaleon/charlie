KitchenSink.Panorama = function(params) {
    return {
        title: "Online restaurant",
        items: [
            {
                header: "Main courses",
                text: "Main courses",
                images: KitchenSink.db.food.mainCourses
            },
            {
                header: "Seafood",
                text: "Seafood",
                images: KitchenSink.db.food.seafood
            },
            {
                header: "Desserts",
                text: "Desserts",
                images: KitchenSink.db.food.desserts
            },
            {
                header: "Drinks",
                text: "Drinks",
                images: KitchenSink.db.food.drinks
            }
        ]
    };
};