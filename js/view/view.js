var App = App || {};
// View
(function() {
    'use strict';
    // Create view and actions to remove items from list of selected food
    App.View.Food = Backbone.View.extend({
      tagName: 'li',
      className: 'selectedItem',
      // Template call for list display
      template: _.template($('#foodListTemplate').html()),
      // Setup event handler to call destroy method
      initialize: function() {
        this.model.on('destroy', this.remove, this);
      },
      // Enable food deletion by binding destroy method to click event
      events:  {
        'click .delete' : 'destroy'
      },
      // Create view via template of JSON parsed model
      render: function() {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);
        return this;
      },
      destroy: function() {
        this.model.destroy();
      },
      remove: function() {
        // Show alert if there is no food in list
        if (this.$el.siblings().length === 0) {
          $('#searchAlert').show();
        }
        this.$el.remove();
      }
    });

    // View
    // Create view and actions to add items to list of selected food
    App.View.Foods = Backbone.View.extend({
      tagName: 'ul',
      className: 'selectedResult',
      // Setup event handler to call addOne method
      initialize: function() {
        this.collection.on('add', this.addOne, this);
      },
      // Iterate to render unordered list of selected food
      render: function() {
        this.collection.each(this.addOne, this);
        return this;
      },
      // Create and append a food DOM element
      addOne: function(item) {
        $('#searchAlert').hide();
        var foodsView = new App.View.Food({ model: item });
        this.$el.append(foodsView.render().el);
      }
    });

    // Create (list and add foods) View
    App.View.AddFoods = Backbone.View.extend({
      el: '#addItem',
      events: {
        'click #itemSubmit' : 'submit'
      },
      submit: function(e) {
        e.preventDefault();
        var foodNames = $('#foodName').text().toString();
        var foodCalories = parseInt($('#foodCalorie').text());

        if (isNaN(foodCalories)) {
          return;
        }
        var item = new App.Model.Food({ name: foodNames, calories: foodCalories }, {validate: true});
        this.collection.add(item);
        // Add to localstorage
        item.save();
      }
    });

    // Create (show total calories) View
    App.View.TotalCalories = Backbone.View.extend({
      el: '#totalCalories',
      initialize: function() {
        this.render();
        this.collection.on('update', this.render, this);
      },
      render: function() {
        var totalCalories = 0;
        this.collection.each(function(obj) {
          totalCalories += parseInt(obj.get('calories'));
        }, this);
        this.$el.text(totalCalories);
        return this;
      }
    });

    // Create search results View
    App.View.SearchResult = Backbone.View.extend({
      hooks: {
        searchButton: $('#searchButton'),
        searchBox: $('#searchBox'),
        searchBoxAlert: $('#searchBoxAlert')
      },
      initialize: function() {
        var self = this;
        this.hooks.searchButton.on('click', function(e) {
          e.preventDefault();
          var query = $.trim(self.hooks.searchBox.val()).toLowerCase();
          if(!query) {
            self.hooks.searchBoxAlert.text('Search Food Name');
            return;
          }
          self.hooks.searchBoxAlert.text('');
          self.getFood(query);
        });
      },
      getFood: function(query) {
        var self = this;
        var searchResults = $('.searchResults');
        searchResults.html('<p>Loading...</p>');
        $.ajax({
          type: 'GET',
          dataType: 'json',
          cache: true,
          url: 'https://api.nutritionix.com/v1_1/search/' + query + '?results=0%3A10&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories&appId=04a80b93&appKey=d7ba4fa0b76a6b707267ac970c803a87'
        }).done(function(data) {
            var item;
            var addButton = $('#itemSubmit');
            var searchItemHTML = '';
            if(data.hits.length <= 0) {
              var noResults = '<p>No results found ' + query + '! Please enter food here...</p>';
              searchResults.html(noResults);
              return;
            }
            for (var i = 0; i < data.hits.length; i++) {
              searchItemHTML += '<li class="searchItem"><span class="searchName">' + data.hits[i].fields.item_name + '</span><span class="searchCalories">' + Math.round(data.hits[i].fields.nf_calories) + ' Calories </span></li>';
            }
            searchResults.html(searchItemHTML);
            var searchItem = $('.searchItem');
            searchItem.on('click', function() {
              addButton.prop('disabled', false);
              var items = $(this).find('.searchName').text();
              var cals = $(this).find('.searchCalories').text();
              $('#foodName').text(items);
              $('#foodCalorie').text(cals);
              return;
            });
          }).fail(function() {
            searchResults.html('<p>Nutritionix API data is unavailable! Please add Nutritionix API data...');
          });
        }
    });
}());