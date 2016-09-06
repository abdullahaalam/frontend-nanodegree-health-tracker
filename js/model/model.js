var App = App || {};
// Model
(function() {
    'use strict';
    // Define Model of Food
    App.Model.Food = Backbone.Model.extend({
      default: {
        name: '',
        calories: 0
      },
      // Ensure that each food item has a name
      validate: function(foodList) {
        if(! $.trim(foodList.name))  {
          return "Please enter a valid 'food' name here!";
        }
        if(! $.trim(foodList.calories))  {
          return "Please enter a valid 'food' calories here!";
        }
      }
    });
}());