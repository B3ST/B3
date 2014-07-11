define([
  'jquery',
  'underscore',
  'marionette',
  'views/header-view',
  'views/footer-view'
], function ($,  _, Marionette, HeaderView, FooterView) {
  var App = new Backbone.Marionette.Application();

  App.addRegions({
    header: 'header',
    main:   '#main',
    footer: 'footer'
  });

  var header = new HeaderView();
  var footer = new FooterView();

  App.header.show(header);
  App.footer.show(footer);

  function isMobile() {
    var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
    return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
  }

  App.mobile = isMobile();

  App.addInitializer(function(options) {
    Backbone.history.start();
  });

  return App;
});