/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var DisplayArchive = Marionette.Behavior.extend({
    events: {},

    /**
     * Trigger the display of an archive by type.
     * @param {String} ev       Event to trigger.
     * @param {Event}  event    Original event.
     * @param {String} taxonomy Archive type (one of 'category', 'post_tag', 'author', ...).
     */
    _trigger: function(ev, event, taxonomy) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');

      EventBus.trigger(ev, { id: id, slug: slug, type: taxonomy });
    }
  });

  return DisplayArchive;
});
