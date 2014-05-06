!function() {
    var currentVersion = 5;
    var storage = {};

    if(!localStorage.getItem("user-data") || localStorage.getItem("data-version") != currentVersion) {
        try {
            localStorage.setItem("data-version", currentVersion);
        } catch(e) {
            // Workaround for Safari Private Browsing on iOS devices
            window.localStorage.setItem = function(key, value) {
                storage[key] = value;
            };
            window.localStorage.getItem = function(key) {
                return storage[key];
            }
            window.localStorage.removeItem = function(key) {
                delete storage[key];
            }
        }

        localStorage.setItem("user-data", JSON.stringify({
            id: "341D70BD-49BB-49D4-8C12-53765EEFDDE2",
            name: "Peter",
            surname: "Smith",
            email: "smith@example.com",
            photo: "Images/Customers/petersmith.png",
            notifications: 12,
            "billingAddress": {
                country: "United States",
                zipCode: 30310,
                state: "GA",
                city: "Atlanta",
                address: "8523 Middle Glen",
                phoneNumber: "(555) 222-8423"
            },
            "shippingAddress": {
                country: "United States",
                zipCode: 30310,
                state: "GA",
                city: "Atlanta",
                address: "8523 Middle Glen",
                phoneNumber: "(555) 222-8423"
            }
        }));

        localStorage.removeItem("cart-data");
    };
}();