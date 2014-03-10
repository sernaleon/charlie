// NOTE object below must be a valid JSON
window.DXSK8 = $.extend(true, window.DXSK8, {
    "config": {
        "endpoints": {
            "db": {
                "local": "http://demos.devexpress.com/DevExtreme/DXSK8/DXSK8.OData/api.svc",
                "production": "http://demos.devexpress.com/DevExtreme/DXSK8/DXSK8.OData/api.svc"
            },
            "storage": {
                "local": "http://demos.devexpress.com/DevExtreme/DXSK8/DXSK8.OData/",
                "production": "http://demos.devexpress.com/DevExtreme/DXSK8/DXSK8.OData/"
            }
        },
        "services": {
            "db": {
                "entities": {
                    "Brands": {
                        "key": "ID"
                    },
                    "ProductTypes": {
                        "key": "ID"
                    },
                    "Skates": {
                        "key": "ID"
                    },
                    "Products": {
                        "key": "ID"
                    },
                    "OrderItems": {
                        "key": "ID"
                    },
                    "Orders": {
                        "key": "ID"
                    },
                    "Employees": {
                        "key": "ID"
                    },
                    "Customers": {
                        "key": "ID"
                    }
                }
            }
        }
    }
});
