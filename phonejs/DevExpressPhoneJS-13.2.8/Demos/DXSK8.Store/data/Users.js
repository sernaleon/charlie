window.DXSK8 = window.DXSK8 || {};
window.DXSK8.Store = window.DXSK8.Store || {};
window.DXSK8.Store.db = window.DXSK8.Store.db || {};

!function() {
    var USER_KEY = "user-data";

    var cachedUserDataString = localStorage.getItem(USER_KEY),
        cachedUserData = cachedUserDataString ? JSON.parse(cachedUserDataString) : null,
        currentUser = new DXSK8.UserViewModel(cachedUserData);

    currentUser.saveLocal = function() {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser.toJS()));
    };

    var db = {};

    db.updateUserProfile = function(id, data, success) {
        DXSK8.db.Customers
            .update(id, mapUser(data, true))
            .done(success);
    };

    function mapUser(user, toServerObject) {
        var map = {
            "Notifications": "notifications",
            "Email": "email",
            "Name": "name",
            "Surname": "surname"
        };

        var toServerObjectMap = $.extend({
            "BillingAddress": function() {
                return mapAddress(user.billingAddress, true);
            },
            "ShippingAddress": function() {
                return mapAddress(user.shippingAddress, true);
            }
        }, map);

        var fromServerObjectMap = $.extend({
            "ID": "id",
            "PhotoUrl": function() {
                return DXSK8.db.getImage(user.photo);
            },
            "billingAddress": function() {
                return mapAddress(user.BillingAddress, false);
            },
            "shippingAddress": function() {
                return mapAddress(user.ShippingAddress, false);
            }
        }, map);
        

        var result = {};
        map = toServerObject ? toServerObjectMap : fromServerObjectMap;
        for(field in map) {
            var mapper = map[field];
            if($.isFunction(mapper)) {
                result[field] = mapper();
            } else {
                if(toServerObject)
                    result[field] = user[mapper];
                else
                    result[mapper] = user[field];
            }
        }
        return result;
    }

    function mapAddress(address, toServerObject) {
        var map = {
            "Country": "country",
            "Postcode": "zipCode",
            "State": "state",
            "City": "city",
            "Address": "address",
            "Phone": "phoneNumber"
        };

        var result = {};
        for(field in map) {
            var mapper = map[field];
            if(toServerObject)
                result[field] = address[map[field]];
            else
                result[map[field]] = address[field];
        }
        return result;
    }

    DXSK8.Store.User = currentUser;
    $.extend(DXSK8.Store.db, db);
}();