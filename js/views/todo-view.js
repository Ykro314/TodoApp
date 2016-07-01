// Individual todo view;

"use strict";

app = app || {};

app.TodoView = Backbone.View.extend({

  tagName: "li",

  className: ".class",

  events: {
    "click .todo-el__close-btn": "destroyModel",
    "dblclick .todo-el__text": "startEdit",
    "blur .todo-el__input": "endEdit",
    "keypress .todo-el__input": "endEditOnEnter",
    "click .todo-el__priority": "changeTodoPriority",
    "click .todo-el__checkbox": "changeTodoCompleted"
  },
  /**
   * Invokes template method.
   * @returns {*}
   */
  render: function(){
    return this.template();
  },
  /**
   * Fills template with data and set it to the el property, returns object for chaining.
   * @returns {app.TodoView}
   */
  template: function (){

    function fillTemplate( template ) {
      var title = template.querySelector( ".todo-el__text" );
      var date = template.querySelector( ".todo-el__date" );
      var priority = template.querySelector( ".todo-el__priority" );
      var checkbox = template.querySelector( ".todo-el__checkbox" );

      title.textContent = this.model.get( "title" );
      date.textContent = this.model.get( "date" );
      priority.classList.add( this.priorityColors[ this.model.get( "priority" ) ] );

      if( this.model.get( "completed" ) === true ) {
        title.style.textDecoration = "line-through";
        checkbox.checked = true;
      }
      else if( this.model.get( "completed" ) === false ) {
        title.style.textDecoration = "";
        checkbox.checked = false;
      }

      return template;
    }

    var template = document.querySelector( "#element-template" );
    var templateContent = template.content.children[0].cloneNode( true );

    // Because while adding on enter, it repaints two times. Its a hotfix for bug.
    if( this.el.innerHTML ) {
      this.el.innerHTML = "";
    }

    this.el.appendChild( fillTemplate.call( this, templateContent ) );

    this.input = this.el.querySelector( ".todo-el__input" );
    //this.priorBtn = this.el.querySelector( ".todo-el__priority" );

    return this;
  },


  initialize: function(){
    this.listenTo( this.model, "change", this.render );
    this.listenTo( this.model, "destroy", this.remove );
  },

  /**
   * Change view to edit mode. Focus on input.
   */
  startEdit: function() {
    this.el.firstElementChild.classList.add( "todo-el--edit" );
    this.input.value = this.model.get( "title" );
    this.input.focus();
  },
  /**
   * Invokes on blur event. Work with data in input. If user correct title - save model. If user cleaned input - destroy todo.
   */
  endEdit: function() {
    this.el.firstElementChild.classList.remove( "todo-el--edit" );
    if( this.input.value ) {
      this.model.save({
        title: this.input.value
      });
    }
    else {
      this.destroyModel();
    }
  },

  /**
   * Invokes on keypress event on enter. Work with data in input. If user correct title - save model. If user cleaned input - destroy todo.
   * @param event {object}
   */
  endEditOnEnter: function( event ){
    var ENTER_KEY = 13;
    if( event.charCode !== ENTER_KEY ) {
      return;
    }
    else if( event.charCode === ENTER_KEY && this.input.value ) {
      this.model.save({
        title: this.input.value
      })
    }
    else if( event.charCode === ENTER_KEY && !this.input.value ) {
      this.destroyModel();
    }
  },

  /**
   * Destroy model. View is firing destroy method, which removes view by event listener.
   */
  destroyModel: function() {
    this.model.destroy();
  },

  /**
   * Change priority on click if it was changed. Then save the model.
   * @param event {object}
   */
  changeTodoPriority: function( event ) {
    var priority = event.target.getAttribute( "data-prior" );
    if( priority && this.model.get( "priority" ) !== priority ) {
      this.model.save({
        priority: priority
      })
    }
  },

  changeTodoCompleted: function() {
    this.model.toggle();
  },

  priorityColors: {
    "1": "low",
    "2": "normal",
    "3": "high"
  }

});