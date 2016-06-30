// Collection todos

"use strict";


var app = app || {};

var Todolist = Backbone.Collection.extend({

  model: app.Todo,

  localStorage: new Backbone.LocalStorage( "todos" )

});

app.Todos = new Todolist();
