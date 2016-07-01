// View AppView

"use strict";


var app = app || {};

app.AppView = Backbone.View.extend({

  el: "#todoApplication",

  events: {
    "keypress .header__input-todo": "createOnEnter",
    "click .header__priority-button": "changePriority",
    "click .clear": "clickOnClearHandler"
    //"click .filters": "clickOnFilterHandler"
  },

  initialize: function( ) {
    this.input = this.el.querySelector( ".header__input-todo" );
    this.todoList = this.el.querySelector( ".todo-list" );
    this.priorityBurtton = this.el.querySelector( ".header__priority-button" );
    this.filters = this.el.querySelectorAll( ".filters__el a" );
    this.main =  this.el.querySelector( "main" );
    this.footer = this.el.querySelector( "footer" );
    this.firstInit = true;
    this.activeFilter = null;

    this.listenTo( app.Todos, "add", this.addOne );
    this.listenTo( app.Todos, "reset", this.addAll );
    this.listenTo( app.Todos, "sort", this.sortListen );
    this.listenTo( app.Todos, "filter", this.sortRoutes );
    this.listenTo( app.Todos, "update", this.render );

    app.Todos.fetch();
    this.render();
  },

  render:function(){
    if( app.Todos.length === 0 ) {
      this.main.style.display = "none";
      this.footer.style.display = "none";
    }
    else {
      this.main.style.display = "";
      this.footer.style.display = "";
    }
  },

  clickOnClearHandler: function( event ){
    if( event.target.classList.contains( "clear__btn--complete-all" ) ) {
      this.markAllTodosCompleted();
    }
    else if( event.target.classList.contains( "clear__btn--clear-completed" ) ){
      this.deleteCompleted();
    }
  },

  markAllTodosCompleted: function(){
    app.Todos.forEach( function( el ){
      if( el.get( "completed" ) === false ){
        el.toggle();
      }
    })
  },

  deleteCompleted: function(){
    var completedArray = app.Todos.filter( function( el ){
      console.log( el, el.get( "completed" ) );
      return el.get( "completed" );
    });
    console.log( completedArray );
    _.invoke( completedArray, "destroy" );
  },

  sortRoutes: function(){
    console.log( "sortCollection", app.RoutedFilter );
    var element = null;
    function getProperFilterEl(){
      Array.prototype.forEach.call( this.filters, function( el ){
        if( el.getAttribute( "data-filter" ) === app.RoutedFilter ) {
          element = el;
          return;
        }
      } );
      return element;
    }
    this.changeActiveFilter( getProperFilterEl.call( this ) );
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