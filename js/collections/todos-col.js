// Collection todos

"use strict";


var app = app || {};

var Todolist = Backbone.Collection.extend({

  model: app.Todo,

  localStorage: new Backbone.LocalStorage( "todos" ),

  //comparator: function( todo ) {
  //  console.log( todo.get( "title" ) );
  //  return -todo.get( "dateInMilliseconds" );
  //},

  sortOnDateInc: function( model ) {
    return model.get("dateInMilliseconds");
  },

  sortOnDateDecr: function( model ) {
    return -model.get("dateInMilliseconds");
  },

  sortOnTopPriority: function( model ) {
    return -model.get( "priority" );
  },

  sortOnLowPriority: function( model ) {
    return model.get( "priority" );
  },

  sortCompletedFirst: function( model ) {
    return model.get( "completed" ) ? 0 : 1;
  },

  sortRemainingFirst: function( model ) {
    return model.get( "completed" ) ? 1 : 0;
  }

});

app.Todos = new Todolist();
