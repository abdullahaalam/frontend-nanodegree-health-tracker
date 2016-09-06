var App = App || {};
// Collection
(function() {
    'use strict';
    // Define Collection of Foods
    App.Collection.Foods = Backbone.Collection.extend({
      model: App.Model.Food,
      // Implement local storage persistence of browser
      localStorage: new Backbone.LocalStorage('LocalFoods')
    });
}());