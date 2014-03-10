window.DXSK8 = window.DXSK8 || {};

DXSK8.OrderItemViewModel = function(name, item) {
    if(item)
        item.image = DXSK8.db.getImage(item.image);
    var model = ko.observable(item);

    this.name = name;
    this.model = model;
    this.isEmpty = ko.computed(function () {
        return model() == null;
    });

    this.selectItem = function(params) {
        var url = "SelectProduct/" + name,
            itemModel = params.model.model() || {};
        if (itemModel.id && DevExpress.devices.current().screenSize !== "small")
            url += "/" + itemModel.id;
        DXSK8.app.navigate(url);
    }

    this.clearItem = function() {
        model(null);
    }
};

DXSK8.AddressViewModel = function(address) {
    address = address || {};
    this.country = ko.observable(address.country || "United States");
    this.zipCode = ko.observable(address.zipCode || 0);
    this.state = ko.observable(address.state);
    this.city = ko.observable(address.city);
    this.address = ko.observable(address.address);
    this.phoneNumber = ko.observable(address.phoneNumber);
    this.countries = DXSK8.Store.Countries;

    this.toJS = function() {
        return {
            country: this.country() || "",
            zipCode: this.zipCode() || 0,
            state: this.state() || "",
            city: this.city() || "",
            address: this.address() || "",
            phoneNumber: this.phoneNumber() || ""
        };
    }
};

DXSK8.UserViewModel = function(user) {
    var endpointSelector = new DevExpress.EndpointSelector(DXSK8.config.endpoints),
        initialized = ko.observable(false),
        self = this;

    function notificationsFromNumber(user, notifications) {
        user.notifications = {
            packageShip: ko.observable((notifications & 8) == 8),
            packageArrive: ko.observable((notifications & 4) == 4),
            weekDeals: ko.observable((notifications & 2) == 2),
            partnerDeals: ko.observable((notifications & 1) == 1)
        };
    }

    function notificationsToNumber(user) {
        return (user.notifications.packageShip() ? 8 : 0)
                + (user.notifications.packageArrive() ? 4 : 0)
                + (user.notifications.weekDeals() ? 2 : 0)
                + (user.notifications.partnerDeals() ? 1 : 0);
    }

    user = user || {};
    this.id = new DevExpress.data.Guid(user.id);
    this.name = ko.observable(user.name);
    this.surname = ko.observable(user.surname);
    this.email = ko.observable(user.email);
    this.photo = ko.observable(DXSK8.db.getImage(user.photo));
    this.billingAddress = new DXSK8.AddressViewModel(user.billingAddress);
    this.shippingAddress = new DXSK8.AddressViewModel(user.shippingAddress);
    notificationsFromNumber(this, user.notifications);

    this.toJS = function() {
        return {
            id: this.id.toString(),
            name: this.name(),
            surname: this.surname(),
            email: this.email(),
            photo: this.photo().replace(endpointSelector.urlFor("storage"), ""),
            billingAddress: this.billingAddress.toJS(),
            shippingAddress: this.shippingAddress.toJS(),
            notifications: notificationsToNumber(this)
        };
    };

    this.profileSaver = ko.computed(function() {
        if(!initialized())
            return;

        var user = self.toJS();
        DXSK8.Store.db.updateUserProfile && DXSK8.Store.db.updateUserProfile(self.id, user, function() {
            DXSK8.Store.User.saveLocal();
        });
    });

    this.logout = function() {
        DevExpress.ui.dialog.alert("Logout is not implemented in this demo application.");
    }

    initialized(true);
};