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
    }
  });

  return LoadingView;
});
