/* global define */

define([
  'backbone',
  'marionette',
  'models/user-model',
  'models/settings-model',
  'collections/taxonomy-collection',
  'helpers/fetchers/sidebar-fetcher',
  'helpers/fetchers/menu-fetcher',
  'buses/command-bus'
], function (Backbone, Marionette, User, Settings, Taxonomies, Sidebars, Menus, CommandBus) {
  'use strict';

  var Initializer = Backbone.Marionette.Controller.extend({
    initialize: function (options) {
      options   = options || {};
      this.app  = options.app;
      this.user = options.user || new User({ ID: 'me' });
    },

    init: function () {
      CommandBus.execute('when:fetched', this._getEntities(), this.onDone.bind(this), this.onFail.bind(this));
    },

    onDone: function () {
      var init = this._getValues.apply(this, arguments);
      this.user.fetch();
      Settings.set({ me: this.user });
      this.app.start(init);
    },

    onFail: function () {

    },

    _getValues: function (settings, sidebars, menus, taxonomies) {
      return {
        sidebars: sidebars[0],
        menus: menus[0],
        taxonomies: new Taxonomies(taxonomies[0])
      };
    },

    _getEntities: function () {
      return [Settings, new Sidebars(), new Menus(), new Taxonomies()];
    }
  });

  return Initializer;
});