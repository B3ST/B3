/* globals define */

define([
  'underscore',
  'backbone',
  'marionette',
  'views/application-view',
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
  'controllers/loading-controller',

  'behaviors/behaviors'
], function (_, Backbone, Marionette, AppView, AppRouter, ArchiveAPI, SingleAPI, SearchAPI, HomeAPI, HeaderController, SidebarController, FooterController, Communicator, Settings) {
  'use strict';

  var App = new Backbone.Marionette.Application(),
      appView = new AppView();

  Communicator.requests.setHandler('default:region', function () {
    return appView.main;
  });

  Communicator.requests.setHandler('is:mobile', function () {
    var ua = (navigator.userAgent || navigator.vendor || window.opera, window, window.document);
    return (/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
  });

  Communicator.events.on('router:nav', function (options) {
    App.appRouter.navigate(options.route, options.options);
  });

  Communicator.events.on('title:change', function (title) {
    var separator = ' | ';
    var newTitle  = '';

    if (_.isFunction(title)) {
      newTitle = title.apply(this, arguments) + separator;

    } else if (_.isString(title)) {
      newTitle = title + separator;
    }

    document.title = newTitle + Settings.get('name');
  });

  Communicator.commands.setHandler('register:controller', function (instance, id) {
    App.register(instance, id);
  });

  Communicator.commands.setHandler('unregister:controller', function (instance, id) {
    App.unregister(instance, id);
  });

  App.addInitializer(function (options) {
    appView.render();
    new HeaderController({ menus: options.menus, region: appView.header }).showHeader();
    new SidebarController({ sidebar: options.sidebars.sidebar, template: 'widget-areas/sidebar-template.dust', region: appView.sidebar }).showSidebar();
    new FooterController({ region: appView.footer }).showFooter();
  });

  App.addInitializer(function (options) {
    App.appRouter = new AppRouter({
      controller: [
        new ArchiveAPI(options),
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
