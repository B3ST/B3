define([
  'jquery',
  'marionette',
  'dust',
  'views/content-single-view-template',
  'views/article-template'
], function ($, Marionette, dust) {
  var ContentSingleView = Backbone.Marionette.ItemView.extend({
    initialize: function (post) {
      this.post = post;
    },

    render: function () {
      var data = this.post.toJSON();
      data['b3type'] = 'single-view';
      dust.render('views/article-template.dust', data, function (err, out) {
        this.setElement(out);
      }.bind(this));

      return this;
    }
  });

  return ContentSingleView;
});