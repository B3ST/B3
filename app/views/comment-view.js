define([
  'jquery',
  'marionette',
  'dust',
  'dust.helpers',
  'dust.marionette',
  'content/comments/comment-template'
], function ($, Marionette, dust, dustHelpers, dustMarionette) {
  var CommentView = Backbone.Marionette.ItemView.extend({
    template: 'content/comments/comment-template.dust',
    tagName: function () {
      return 'li id="comment-' +  this.model.get('ID') + '"';
    }
  });

  return CommentView;
});