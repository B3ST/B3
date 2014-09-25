/* global define */

define([
  'backbone',
  'marionette',
  'controllers/single-controller',
  'models/post-model'
], function (Backbone, Marionette, SingleController, Post) {
  'use strict';

  var SingleAPI = Backbone.Marionette.Controller.extend({
    showPostBySlug: function (params) {
      var post = new Post({ slug: params.post });
      this._showSingle(post, 'content/type-post-template.dust');
    },

    showCustomPost: function (params) {

    },

    showPageBySlug: function (params) {

    },

    _showSingle: function (post, template) {
      new SingleController({ model: post, template: template }).showSingle();
    }
  });

  return SingleAPI;
});