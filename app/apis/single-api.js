/* global define */

define([
  'backbone',
  'marionette',
  'controllers/single-controller',
  'models/post-model',
  'models/page-model'
], function (Backbone, Marionette, SingleController, Post, Page) {
  'use strict';

  var SingleAPI = Backbone.Marionette.Controller.extend({
    showPostBySlug: function (params) {
      var post = new Post({ slug: params.post });
      this._showSingle(post, 'content/type-post-template.dust');
    },

    showPageBySlug: function (params) {
      var page = new Page({ slug: params.page });
      this._showSingle(page, 'content/type-page-template.dust');
    },

    showPostTypeBySlug: function (params) {

    },

    _showSingle: function (model, template) {
      new SingleController({ model: model, template: template }).showSingle();
    }
  });

  return SingleAPI;
});