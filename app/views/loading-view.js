/* global define */

define([
  'jquery',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'navigation/loading-template'
  /* jshint unused: false */
], function ($, Backbone, Marionette, dust, dustMarionette) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    template: 'navigation/loading-template.dust',
    tagName:  'div class="modal bs-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true"',

    onRender: function () {
      var now = Math.floor(Math.random() * 100 + 1);
      this.$('.progress-bar').css('width', now + '%')
                             .attr('aria-valuenow', now);
      this.$el.modal('toggle');
    },

    onDestroy: function () {
      this.$el.modal('toggle');
    }
  });

  return LoadingView;
});