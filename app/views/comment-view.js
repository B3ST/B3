define([
  'jquery',
  'marionette',
  'dust',
  'dust.helpers',
  'dust.marionette',
  'views/comment-view-template'
], function ($, Marionette, dust, dustHelpers, dustMarionette) {
  var CommentView = Backbone.Marionette.ItemView.extend({
    template: 'views/comment-view-template.dust',
    tagName: function () {
      return 'li id="comment-' +  this.model.get('ID') + '"';
    }
  });

  return CommentView;
});