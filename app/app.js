/* globals define */

define([
  'underscore',
  'backbone',
  'marionette',
  'routers/app-router',
  'apis/archive-api',
  'apis/single-api',
  'apis/search-api',
  'apis/home-api',
  'controllers/header-controller',
  'controllers/sidebar-controller',
  'controllers/footer-controller',
  'buses/communicator',
  'models/settings-model',

  'config/marionette/application',
  'controllers/loading-controller'
], function (_, Backbone, Marionette, AppRouter, ArchiveAPI, SingleAPI, SearchAPI, HomeAPI, HeaderController, SidebarController, FooterController, Communicator, Settings) {
  'use strict';

  var App = new Backbone.Marionette.Application();

  App.navigate = function(route, options){
    options = options || {};
    this.appRouter.navigate(route, options);
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

  Communicator.requests.setHandler('default:region', function () {
    return App.main;
  });

  Communicator.events.on('router:nav', function (options) {
    App.navigate(options.route, options.options);
  });

  Communicator.events.on('title:change', function (title) {
    App.titleChange(title);
  });

  Communicator.commands.setHandler('register:controller', function (instance, id) {
    App.register(instance, id);
  });

  Communicator.commands.setHandler('unregister:controller', function (instance, id) {
    App.unregister(instance, id);
  });

  App.mobile = isMobile();

  App.addRegions({
    header:  '#header',
    main:    '#main',
    sidebar: '#sidebar',
    footer:  '#footer'
  });

  App.addInitializer(function (options) {
    new HeaderController({ menus: options.menus, region: App.header }).showHeader();
    new SidebarController({ sidebar: options.sidebars.sidebar, template: 'widget-areas/sidebar-template.dust', region: App.sidebar }).showSidebar();
    new FooterController({ region: App.footer }).showFooter();
  });

  App.addInitializer(function () {
    App.appRouter = new AppRouter({
      controller: [
        new ArchiveAPI(),
        new SingleAPI(),
        new SearchAPI(),
        new HomeAPI()
      ],
    });

    if (Backbone.history) {
      Backbone.history.start({ pushState: true, root: Settings.get('site_path') });
    }
  });

  return App;
});
