/* global define */

define([
  'backbone',
  'marionette',
  'behaviors/loading-behavior',
  'templates/loading-template'
], function (Backbone) {
  'use strict';

  var LoadingView = Backbone.Marionette.ItemView.extend({
    template: 'loading-template.dust',
    tagName:  'div id="progress-loading"',

    behaviors: {
      Loading: {}
    },

    progress: function (options) {
      var progress = options.loaded / options.total * 100;

      this.$('.progress-bar').prop('aria-valuenow', progress)
                             .css('width', progress + '%');
      this.$('.screen-reader-text').text(progress + '% Complete');
    }
  });

  return LoadingView;
});
