// View AppView

"use strict";


var app = app || {};

app.AppView = Backbone.View.extend({

  el: "#todoApplication",

  events: {
    "keypress .header__input-todo": "createTodoOnEnter",
    "click .header__priority-button": "changeNewTodoPriority",
    "click .clear": "clickOnClearHandler"
  },
  /**
   * Cache elements, bind listeners to the Todos collection, fill collection with data and render app.
   */
  initialize: function( ) {
    this.input = this.el.querySelector( ".header__input-todo" );
    this.todoList = this.el.querySelector( ".todo-list" );
    this.priorityButton = this.el.querySelector( ".header__priority-button" );
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

  /**
   * If collection is empty - hide main and footer. Otherwise show it. Reacts on collection update event.
   */
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

  /**
   * Handle click on clear panel.
   * @param event {object}
   */
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

  /**
   * Create array with completed todos, then destroy all of them.
   */
  deleteCompleted: function(){
    var completedArray = app.Todos.filter( function( el ){
      return el.get( "completed" );
    });
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

  /**
   * Repaint todo-list, only if app was rendered not the first time.
   */
  sortListen: function(){
    if( this.firstInit ) {
      this.firstInit = false;
    }
    else if( !this.firstInit ) {
      this.todoList.innerHTML = "";
      this.addAll();
    }
  },
  
  /**
   * Create view for model and render it to the page by adding in todo-list element.
   * @param todo {object}
   */
  addOne: function( todo ) {
    var view = new app.TodoView( { model: todo } );
    this.todoList.appendChild( view.render().el );
  },
  
  addAll: function() {
    this.todoList.innerHTML = "";
    app.Todos.each( this.addOne, this );
  },

  /**
   * If user pressed enter - create new Todo. 
   * @param event {object}
   */
  createTodoOnEnter: function( event ) {
    var ENTER_KEY = 13;
    if( event.charCode !== ENTER_KEY ) {
      return;
    }
    else if( event.charCode === ENTER_KEY && this.input.value ) {
      app.Todos.create( this.getTodoData() );
      this.input.value = "";
    }
  },

  /**
   * Create data object from input.
   * @returns {{title: *, dateInMilliseconds: number, date: *, priority: string}}
   */
  getTodoData: function() {

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

  /**
   * Change priority for new Todo.
   * @param event {object}
   */
  changeNewTodoPriority: function( event ) {
    event.target.classList.toggle( "show" );
    var priorityAttribute = event.target.getAttribute( "data-priority" );
    if( priorityAttribute ) {
      this.input.setAttribute( "data-priority", priorityAttribute );
      this.priorityButton.style.background = this.priorityColors[ priorityAttribute ];
      this.priorityButton.classList.remove( "show" );
    }
  },

  /**
   * Change active filter and highlight it.
   * @param element {node}
   */
  changeActiveFilter: function( element ){
    if( !this.activeFilter ){
      element.classList.add( "active" );
    }
    if( this.activeFilter && element !== this.activeFilter ) {
      this.activeFilter.classList.remove( "active" );
      element.classList.add( "active" );
    }
    this.activeFilter = element;
  },

  /**
   * Change compatator function. Then sort collection.
   * @param filtername {string}
   */
  sortCollection: function( filtername ) {
    app.Todos.comparator = app.Todos.sortFunctions[ filtername ];
    app.Todos.sort();
  },

  priorityColors: {
    "1": "yellow",
    "2": "green",
    "3": "red"
  }

});