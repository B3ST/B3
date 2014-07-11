define([
  'jquery',
  'backbone',
  'dust',
  'text!templates/views/footer-view-template.html'
], function ($, Backbone, dust, FooterViewTemplate) {
  var FooterView = Backbone.View.extend({
    render: function () {
      var compiled = dust.compile(FooterViewTemplate, "render:footer");
      dust.loadSource(compiled);

      dust.render("render:header", {}, function (err, out) {
        this.setElement(out);
      }.bind(this));

      return this;
    },
  });

  return FooterView;
});