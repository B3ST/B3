/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  window.Behaviors.DisplayPost = Marionette.Behavior.extend({
    events: {
      'click @ui.title': 'onTitleClicked'
    },

    onTitleClicked: function (event) {
      var slug = $(event.currentTarget).attr('slug'),
          id   = parseInt(event.currentTarget.id, 10),
          post = this.view.collection.findWhere({ ID: id });

      EventBus.trigger(this.options.event, { slug: slug, post: post });
      event.preventDefault();
    }
  });
});