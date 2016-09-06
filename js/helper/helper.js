var App = App || {};
// Helper
(function() {
    'use strict';
    // Create namspaces
    window.App = {
      Model: {},
      Collection: {},
      View: {},
      Helper: {}
    };

    // Helper functin for templating
    App.Helper.template = function(id) {
        return _.template($('#' + id).html());
    };
}());