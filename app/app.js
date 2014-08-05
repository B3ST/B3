/* globals define */

(function () {
  'use strict';

  define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'routers/app-router',
    'controllers/single-type-controller',
    'controllers/archive-type-controller',
    'controllers/search-controller',
    'controllers/loading-controller',
    'controllers/bus/event-bus',
    'models/settings-model',
    'models/user-model',
    'models/sidebar-model',
    'collections/post-collection',
    'views/header-view',
    'views/sidebar-view',
    'views/footer-view'
  ], function ($, _, Backbone, Marionette, AppRouter, SingleTypeController, ArchiveTypeController, SearchController, LoadingController, EventBus, Settings, User, Sidebar, Posts, HeaderView, SidebarView, FooterView) {

    var App = new Backbone.Marionette.Application(),
        user = new User({ID: 'me'});

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

    function getMenus () {
      return $.get(Settings.get('apiUrl') + '/b3:menus');
    }

    function getSidebars () {
      return $.get(Settings.get('apiUrl') + '/b3:sidebars');
    }

    function initializeLayout (menus, sidebars) {
      App.header.show(new HeaderView({menus: menus}));

      if (sidebars && sidebars.sidebar) {
        App.sidebar.show(new SidebarView({model: new Sidebar(sidebars.sidebar)}));
      }

      App.footer.show(new FooterView());
    }

    function initializeRoutes (menus) {
      var options = {
        app:   App,
        posts: new Posts(),
        user:  user,
        menus: menus
      };

      var controllers = [
        new SingleTypeController(options),
        new ArchiveTypeController(options),
        new SearchController(options)
      ];

      App.appRouter = new AppRouter({
        controller: controllers,
      });

      if(Backbone.history) {
        Backbone.history.start({pushState: true, root: Settings.get('path')});
      }
    }

    function initializeControllers () {
      new LoadingController({region: App.main});
    }

    function initializeEvents () {
      EventBus.bind('router:nav', function (options) {
        App.navigate(options.route, options.options);
      });

      EventBus.bind('title:change', function (title) {
        App.titleChange(title);
      });
    }

    function initializeResources () {
      getMenus().then(function (menus) {
        getSidebars().done(function (sidebars) {
          user.fetch();
          initializeLayout(menus, sidebars);
          initializeRoutes(menus);
          initializeControllers();
          initializeEvents();
        });
      }); /* TODO: need a fail view .fail(); */

      App.addRegions({
        header:  '#header',
        main:    '#main',
        sidebar: '#sidebar',
        footer:  '#footer'
      });
    }

    App.mobile = isMobile();

    App.addInitializer(initializeResources);

    return App;
  });

})();
