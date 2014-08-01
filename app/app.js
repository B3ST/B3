/* globals define */

(function () {
  'use strict';

  define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'routers/app-router',
    'controllers/controller',
    'controllers/event-bus',
    'models/settings-model',
    'models/user-model',
    'models/sidebar-model',
    'collections/post-collection',
    'views/header-view',
    'views/sidebar-view',
    'views/footer-view'
  ], function ($, _, Backbone, Marionette, AppRouter, Controller, EventBus, Settings, User, Sidebar, Posts, HeaderView, SidebarView, FooterView) {

    var App   = new Backbone.Marionette.Application(),
        user  = new User({ID: 'me'});

    App.navigate = function(route, options){
      options = options || {};
      this.appRouter.navigate(route, options);
      $('body,html').animate({
        scrollTop: 0
      }, 800);
    };

    App.titleChange = function(title) {
      var separator = ' | ';
      var newTitle  = '';

      if (_.isFunction(title)) {
        newTitle = title.apply(this, arguments) + separator;

      } else if (_.isString(title)) {
        newTitle = title + separator;
      }

      document.title = newTitle + Settings.get('name');
    };

    function isMobile() {
      var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
      return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }

    function initializeLayout (menus, sidebars) {
      App.header.show(new HeaderView({menus: menus}));

      if (sidebars && sidebars.sidebar) {
        App.widgets.show(new SidebarView({model: new Sidebar(sidebars.sidebar)}));
      }

      App.footer.show(new FooterView());

      App.appRouter = new AppRouter({
        controller: new Controller({
          app:   App,
          posts: new Posts(),
          user:  user,
          menus: menus
        })
      });

      if(Backbone.history) {
        Backbone.history.start({pushState: true, root: Settings.get('path')});
      }
    }

    function getMenus () {
      return $.get(Settings.get('apiUrl') + '/b3:menus');
    }

    function getSidebars () {
      return $.get(Settings.get('apiUrl') + '/b3:sidebars');
    }

    App.mobile = isMobile();

    App.addInitializer(function() {
      getMenus().then(function (menus) {
        getSidebars().done(function (sidebars) {
          user.fetch();
          initializeLayout(menus, sidebars);
        });
      }); /* TODO: need a fail view .fail(); */

      EventBus.bind('router:nav', function (options) {
        App.navigate(options.route, options.options);
      });

      EventBus.bind('title:change', function (title) {
        App.titleChange(title);
      });

      App.addRegions({
        header:  '#header',
        main:    '#main',
        widgets: '#widgets',
        footer:  '#footer'
      });
    });

    return App;
  });

})();
