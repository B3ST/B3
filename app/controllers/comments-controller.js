/* global define */

define([
  'controllers/base-controller',
  'views/comments-view',
  'collections/comment-collection'
], function (BaseController, CommentsView, Comments) {
  'use strict';

  var CommentsController = BaseController.extend({
    showComments: function (options) {
      this.collection = this._commentsFromPost(options.model);
      this.show(this._commentsView(this.collection, options.model), { loading: true, region: options.region });
    },

    _commentsFromPost: function (model) {
      return new Comments({ uri: model.get('meta').links['b3:replies'] });
    },

    _commentsView: function (collection, model) {
      return new CommentsView({ collection: collection, model: model });
    }
  });

  return CommentsController;
});