define([
  'jquery',
  'backbone',
  'marionette',
  'underscore'
], function ($, Backbone, Marionette, _) {
  var App = new Backbone.Marionette.Application();

  //Organize Application into regions corresponding to DOM elements
  //Regions can contain views, Layouts, or subregions nested as necessary
  App.addRegions({
    main: "#main",
  });

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