$('button').click(function() {
   $('.searchResults').empty();
});
$(function() {
    'use strict';
    // Initialize App
    var foodsCollection = new App.Collection.Foods([]);
    foodsCollection.fetch();
    var addFoodView = new App.View.AddFoods({ collection: foodsCollection });
    var listFoods = new App.View.Foods({ collection: foodsCollection });
    var totalFoodCal = new App.View.TotalCalories({ collection: foodsCollection});
    var searchResult = new App.View.SearchResult();
    $('.foodsListView').html(listFoods.render().el);
}());