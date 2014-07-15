define([
  'jquery',
  'backbone',
  'dust',
  'views/footer-view-template'
], function ($, Backbone, dust) {
  var FooterView = Backbone.View.extend({
    render: function () {
      dust.render("views/footer-view-template.dust", {}, function (err, out) {
        this.setElement(out);
      }.bind(this));

      return this;
    },
  });

  return FooterView;
});