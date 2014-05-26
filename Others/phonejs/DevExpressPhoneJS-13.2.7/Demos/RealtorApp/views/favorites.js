RealtorApp.Favorites = function (params) {

    var viewModel = {
        noDataText: 'You have not added any properties to your favorites yet',
        favoritesItemClick: function (item) {
            RealtorApp.app.navigate("Details/" + item.model.ID);
        }
    };

    return viewModel;
};