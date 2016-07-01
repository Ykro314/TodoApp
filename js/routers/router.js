// Todo router

"use strict";

app = app || {};

app.TodoRouter = Backbone.Router.extend({
  routes: {
    "*filter" : "changeOnRoute"
  },

  changeOnRoute: function( route ){
    console.log( "routing " + route );
    app.RoutedFilter = route;
    app.Todos.trigger( "filter" );
  }
});

var workspace = new app.TodoRouter();

Backbone.history.start();

