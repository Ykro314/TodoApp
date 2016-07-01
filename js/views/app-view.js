// View AppView

"use strict";


var app = app || {};

app.AppView = Backbone.View.extend({

  el: "#todoApplication",

  events: {
    "keypress .header__input-todo": "createOnEnter",
    "click .header__priority-button": "changePriority",
    "click .filters": "clickOnFilterHandler"
  },

  initialize: function( ) {
    this.input = this.el.querySelector( ".header__input-todo" );
    this.todoList = this.el.querySelector( ".todo-list" );
    this.priorityBurtton = this.el.querySelector( ".header__priority-button" );
    this.firstInit = true;
    this.activeFilter = null;

    this.listenTo( app.Todos, "add", this.addOne );
    this.listenTo( app.Todos, "reset", this.addAll );
    this.listenTo( app.Todos, "sort", this.sortListen );
    this.listenTo( app.Todos, "filter", this.sortRoutes );

    app.Todos.fetch();
  },

  sortRoutes: function(){
    console.log( "sortCollection", app.RoutedFilter );
    this.sortCollection( app.RoutedFilter );
  },

  sortListen: function(){
    if( this.firstInit ) {
      this.firstInit = false;
    }
    else if( !this.firstInit ) {
      this.todoList.innerHTML = "";
      this.addAll();
    }
  },

  addOne: function( todo ) {
    var view = new app.TodoView( { model: todo } );
    this.todoList.appendChild( view.render().el );
  },

  addAll: function() {
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
      dateInMilliseconds: Date.now(),
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
      app.Todos.create( this.getTodoText() );
      this.input.value = "";
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

  clickOnFilterHandler: function( event ) {
    if( event.target.tagName.toUpperCase() === "A" ) {
      //event.preventDefault();

      //if( !this.activeFilter ){
      //  event.target.style.color = "red";
      //}
      //if( this.activeFilter && event.target !== this.activeFilter ) {
      //  this.activeFilter.style.color = "";
      //  event.target.style.color = "red";
      //}
      //
      //switch ( event.target.getAttribute( "data-filter" ) ) {
      //  case "latest":
      //    app.Todos.comparator = app.Todos.sortOnDateInc;
      //    break;
      //  case "newest":
      //    app.Todos.comparator = app.Todos.sortOnDateDecr;
      //    break;
      //  case "top-pr":
      //    app.Todos.comparator = app.Todos.sortOnTopPriority;
      //    break;
      //  case "low-pr":
      //    app.Todos.comparator = app.Todos.sortOnLowPriority;
      //    break;
      //  case "completed":
      //    app.Todos.comparator = app.Todos.sortCompletedFirst;
      //    break;
      //  case "remaining":
      //    app.Todos.comparator = app.Todos.sortRemainingFirst;
      //    break;
      //}
      //
      //app.Todos.sort();
      //this.activeFilter = event.target;
      this.changeActiveFilter( event.target );
      this.sortCollection( event.target.getAttribute( "data-filter" ) )
    }
  },

  changeActiveFilter: function( element ){
    if( !this.activeFilter ){
      element.style.color = "red";
    }
    if( this.activeFilter && element !== this.activeFilter ) {
      this.activeFilter.style.color = "";
      element.style.color = "red";
    }
    this.activeFilter = element;
  },

  sortCollection: function( filterName ){
    switch ( filterName ) {
      case "latest":
        app.Todos.comparator = app.Todos.sortOnDateInc;
        break;
      case "newest":
        app.Todos.comparator = app.Todos.sortOnDateDecr;
        break;
      case "top-pr":
        app.Todos.comparator = app.Todos.sortOnTopPriority;
        break;
      case "low-pr":
        app.Todos.comparator = app.Todos.sortOnLowPriority;
        break;
      case "completed":
        app.Todos.comparator = app.Todos.sortCompletedFirst;
        break;
      case "remaining":
        app.Todos.comparator = app.Todos.sortRemainingFirst;
        break;
    }

    app.Todos.sort();
  },

  priorityColors: {
    "1": "yellow",
    "2": "green",
    "3": "red"
  }

});