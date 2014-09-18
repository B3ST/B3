/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'dust',
  'dust.marionette',
  'buses/command-bus',
  'templates/loading-template'
  /* jshint unused: false */
], function ($, _, Backbone, Marionette, dust, dustMarionette, CommandBus) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    template: 'loading-template.dust',
    tagName:  'div id="loading"',

    progress: function (options) {
      var progress = options.loaded / options.total * 100;

      this.$('.progress-bar').prop('aria-valuenow', progress)
                             .css('width', progress + '%');
      this.$('.screen-reader-text').text(progress + '% Complete');
    }
  });

  return LoadingView;
});
