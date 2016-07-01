// Todo router

"use strict";

app = app || {};

app.TodoRouter = Backbone.Router.extend({

  routes: {
    "*filter" : "changeOnRoute"
  },

  /**
   * Save route string in global property and trigger filter event. This starts changing todo elements order.
    * @param route {string}
   */

  changeOnRoute: function( route ){
    console.log( "routing " + route );
    app.RoutedFilter = route;
    app.Todos.trigger( "filter" );
  }
});

var workspace = new app.TodoRouter();
Backbone.history.start();

