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
    "keypress .todo-el__input": "endEditOnEnter"
  },

  render: function(){
    console.log( "invoke template" );
    return this.template();
  },

  template: function (){
    console.log( "start templating" );

    function fillTemplate( template ) {
      var title = template.querySelector( ".todo-el__text" );
      var date = template.querySelector( ".todo-el__date" );
      var priority = template.querySelector( ".todo-el__priority" );

      title.textContent = this.model.get( "title" );
      date.textContent = this.model.get( "date" );
      priority.classList.add( this.model.get( "priority" ) );

      //console.log( template );

      return template;
    }

    var template = document.querySelector( "#element-template" );
    var templateContent = template.content.children[0].cloneNode( true );

    if( this.el.innerHTML ) {
      this.el.innerHTML = "";
    }
    //this.$el.html( fillTemplate.call( this, templateContent) );

    this.el.appendChild( fillTemplate.call( this, templateContent ) );

    this.input = this.el.querySelector( ".todo-el__input" );

    return this;
  },


  initialize: function(){
    this.listenTo( this.model, "change", this.render );
    this.listenTo( this.model, "destroy", this.remove );
  },

  startEdit: function() {
    this.el.firstElementChild.classList.add( "todo-el--edit" );
    this.input.value = this.model.get( "title" );
    this.input.focus();
  },

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

  destroyModel: function() {
    this.model.destroy();
  }

});