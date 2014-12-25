/* global define */

define([
  'backbone',
  'marionette',
  'buses/event-bus'
], function (Backbone, Marionette, EventBus) {
  'use strict';

  var DisplayArchive = Marionette.Behavior.extend({
    /**
     * Archive link activation handler.
     * @param {Event} event Click event.
     */
    onArchiveLinkClicked: function (event) {
      var id   = parseInt(event.currentTarget.id, 10),
          slug = $(event.currentTarget).attr('slug');
      EventBus.trigger(this.options.event, { id: id, slug: slug, type: this.options.type });
      event.preventDefault();
    }
  });

  return DisplayArchive;
});
