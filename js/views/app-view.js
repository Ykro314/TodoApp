// View AppView

"use strict";


var app = app || {};

app.AppView = Backbone.View.extend({

  el: "#todoApplication",

  events: {
    "keypress .header__input-todo": "createOnEnter",
    "click .header__priority-button": "changePriority"
  },

  initialize: function( ) {
    this.input = this.el.querySelector( ".header__input-todo" );
    this.todoList = this.el.querySelector( ".todo-list" );
    this.priorityBurtton = this.el.querySelector( ".header__priority-button" );

    this.listenTo( app.Todos, "add", this.addOne );
    this.listenTo( app.Todos, "reset", this.addAll );

    app.Todos.fetch();
  },

  addOne: function( todo ) {
    var view = new app.TodoView( { model: todo } );
    console.log( "addOne" );
    this.todoList.appendChild( view.render().el );
    //this.todoList.append( view.render().el );
  },

  addAll: function() {
    console.log( "resetting" );
    this.todoList.innerHTML = "";
    app.Todos.each( this.addOne, this );
  },

  getTodoText: function() {

    function setFormattedDate() {
      var date = new Date(),
        formattedDateString;

      formattedDateString = "Created at " + date.getDate() + "." + ( date.getMonth() + 1 ) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

      return formattedDateString;
    }

    return {
      title: this.input.value,
      date: setFormattedDate.call( this ),
      priority: this.input.getAttribute( "data-priority" )
    }

  },

  createOnEnter: function( event ) {
    var ENTER_KEY = 13;
    if( event.charCode !== ENTER_KEY ) {
      return;
    }
    else if( event.charCode === ENTER_KEY && this.input.value ) {
      console.log( "creating" );
      app.Todos.create( this.getTodoText() );
      this.input.value = "";
      console.log( "end creating" );
    }
  },

  changePriority: function( event ) {
    event.target.classList.toggle( "show" );
    if( event.target.getAttribute( "data-priority" ) ) {
      var priority = event.target.getAttribute( "data-priority" );
      this.input.setAttribute( "data-priority", priority );

      this.priorityBurtton.style.background = this.priorityColors[ priority ];
      this.priorityBurtton.classList.remove( "show" );
    }
  },

  priorityColors: {
    "low": "yellow",
    "normal": "green",
    "high": "red"
  }

});