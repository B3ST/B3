/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var NavigationPost = Marionette.Behavior.extend({

    events: {
      'click @ui.postLink': 'onPostLinkClicked'
    },

    onPostLinkClicked: function (event) {
      var slug = $(event.currentTarget).attr('slug'),
          id   = parseInt($(event.currentTarget).data('id'), 10),
          post = this.view.collection.findWhere({ ID: id });

      EventBus.trigger('archive:view:display:post', { slug: slug, post: post });
      event.preventDefault();
    }
  });

  /**
   * Register display post behavior.
   * @type {NavigationPost}
   */
  window.Behaviors.NavigationPost = NavigationPost;

  return NavigationPost;
});
