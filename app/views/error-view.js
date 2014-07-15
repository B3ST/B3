define([
  'jquery',
  'marionette',
  'views/error-view-template'
], function ($, Marionette) {
  var ErrorView = Backbone.Marionette.ItemView.extend({
    tagName: 'div id="b3-error"',

    render: function () {
      dust.render('views/error-view-template.dust', {}, function (err, out) {
        this.$el.html(out);
      }.bind(this));
    }
  });

  return ErrorView;
});