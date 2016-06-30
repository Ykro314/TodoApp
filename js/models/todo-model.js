// Todo model

"use strict";


var app = app || {};

app.Todo = Backbone.Model.extend({

  defaults: {
    title: "",
    date: "",
    priority: "normal",
    completed: false
  },

  toggle: function() {
    this.save( {
      completed: !this.get( "completed" )
    } )
  }

});