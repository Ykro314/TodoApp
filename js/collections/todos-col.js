// Collection todos

"use strict";


var app = app || {};

var Todolist = Backbone.Collection.extend({

  model: app.Todo,

  localStorage: new Backbone.LocalStorage( "todos" ),

  /**
   * Default compatator function, sorts collection by date, from latest to newest. Same order persist with default adding.
   * @param todo {object}
   * @returns {number}
   */
  comparator: function( todo ) {
    return -todo.get( "dateInMilliseconds" );
  },

  /**
   * Sorting is going on by data-filter parameter.
   * @enum {function}
   */
  sortFunctions: {
    "latest": function( model ) {
      return model.get( "dateInMilliseconds" );
    },
    "newest": function( model ) {
      return -model.get( "dateInMilliseconds" );
    },
    "low-pr": function( model ) {
      return model.get( "priority" );
    },
    "top-pr": function( model ) {
      return -model.get( "priority" );
    },
    "completed": function( model ) {
      return model.get( "completed" ) ? 0 : 1;
    },
    "remaining": function( model ) {
      return model.get( "completed" ) ? 1 : 0;
    }
  }

});

app.Todos = new Todolist();
