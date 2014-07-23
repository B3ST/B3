define([
  'jquery',
  'underscore',
  'marionette',
  'routers/app-router',
  'controllers/controller',
  'controllers/event-bus',
  'models/settings-model',
  'models/user-model',
  'collections/post-collection',
  'views/header-view',
  'views/footer-view'
], function ($,  _, Marionette, AppRouter, Controller, EventBus, Settings, User, Posts, HeaderView, FooterView) {
  var App = new Backbone.Marionette.Application();
  var user = new User({ID: 'me'});

  App.navigate = function(route, options){
    options = options || {};
    this.appRouter.navigate(route, options);
  };

  function isMobile() {
    var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
    return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
  };

  App.mobile = isMobile();

  App.addInitializer(function(options) {
    user.fetch();

    EventBus.bind('router:nav', function (options) {
      App.navigate(options.route, options.options);
    });

    App.addRegions({
      header: '#header',
      main:   '#main',
      footer: '#footer'
    });

    App.header.show(new HeaderView());
    App.footer.show(new FooterView());

    App.appRouter = new AppRouter({
      controller: new Controller({
        app:   App,
        posts: new Posts(),
        user:  user
      })
    });

    if(Backbone.history) {
      Backbone.history.start({pushState: true, root: Settings.get('path')});
    }
  });

  return App;
});
