// Todo model

"use strict";


var app = app || {};

app.Todo = Backbone.Model.extend({

  defaults: {
    title: "",
    date: "",
    dateInMilliseconds: 0,
    priority: "2",
    completed: false
  },

  /**
   * Toggle completed property in model and save it.
   */
  toggle: function() {
    this.save( {
      completed: !this.get( "completed" )
    } )
  }

});