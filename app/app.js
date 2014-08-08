/* globals define */

(function () {
  'use strict';

  define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'routers/app-router',
    'controllers/single-controller',
    'controllers/archive-controller',
    'controllers/search-controller',
    'controllers/loading-controller',
    'controllers/taxonomy-controller',
    'controllers/bus/event-bus',
    'controllers/bus/command-bus',
    'models/settings-model',
    'models/user-model',
    'models/sidebar-model',
    'collections/post-collection',
    'collections/taxonomy-collection',
    'views/header-view',
    'views/sidebar-view',
    'views/footer-view'
  ], function ($, _, Backbone, Marionette, AppRouter, SingleController, ArchiveController, SearchController, LoadingController, TaxonomyController, EventBus, CommandBus, Settings, User, Sidebar, Posts, Taxonomies, HeaderView, SidebarView, FooterView) {

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
      return $.get(Settings.get('api_url') + '/b3:menus');
    }

    function getSidebars () {
      return $.get(Settings.get('api_url') + '/b3:sidebars');
    }

    function getSettings () {
      return Settings.fetch();
    }

    function getTaxonomies () {
      return new Taxonomies().fetch();
    }

    function initializeLayout (menus, sidebars) {
      App.header.show(new HeaderView({menus: menus}));

      if (sidebars && sidebars.sidebar) {
        App.sidebar.show(new SidebarView({model: new Sidebar(sidebars.sidebar)}));
      }

      App.footer.show(new FooterView());
    }

    function initializeRoutes () {
      var controllers = [
        new SingleController({
          app:  App,
          user: User
        }),
        new ArchiveController({
          app:   App,
          posts: new Posts(),
          user:  user
        }),
        new SearchController({
          app: App,
          posts: new Posts()
        })
      ];

      App.appRouter = new AppRouter({
        controller: controllers,
      });

      if(Backbone.history) {
        Backbone.history.start({pushState: true, root: Settings.get('site_path')});
      }
    }

    function initializeControllers (params) {
      CommandBus.setHandler('loading:show', function (data) {
        new LoadingController(data).displayLoading();
      });

      new TaxonomyController({
        taxonomies: new Taxonomies(params.taxonomies)
      });
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
      $.when(getSettings(), getMenus(), getSidebars(), getTaxonomies()).then(function (settings, menus, sidebars, taxonomies) {
        Settings.set(settings[0]);
        var params = {
          taxonomies: taxonomies[0]
        };
        user.fetch();
        initializeLayout(menus[0], sidebars[0]);
        initializeEvents();
        initializeControllers(params);
        initializeRoutes(menus[0]);
      }); /* TODO: need a fail view on .fail() */

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
