/* global define */

define([
  'underscore',
  'backbone',
  'marionette',
  'buses/communicator',
  'views/not-found-view'
], function (_, Backbone, Marionette, Communicator, NotFoundView) {
  'use strict';

  var BaseController = Backbone.Marionette.Controller.extend({
    constructor: function (options) {
      options = options || {};

      this.region = options.region || Communicator.requests.request('default:region');
      this.instanceId = _.uniqueId('controller');

      if (typeof(this.initialize) === 'function') {
        this.initialize(options);
      }

      this._initChildControllers();
      this._initBusEvents();
      Communicator.commands.execute('register:controller', this, this.instanceId);
    },

    unregister: function () {
      this._removeBusEvents();
      this._removeChildControllers();
      Communicator.commands.execute('unregister:controller', this, this.instanceId);
      this.destroy();
    },

    show: function (view, options) {
      options = options || {};
      _.defaults(options, { loading: false, region: this.region });
      this._setMainView(view, options);
      this._manageView(view, options);
    },

    /**
     * Creates a new `NotFoundView` instance.
     *
     * @return {NotFoundView} New "Not found" view instance.
     */
    notFoundView: function () {
      return new NotFoundView();
    },

    _setMainView: function (view) {
      if (!this.mainView && view !== null) {
        this.mainView = view;
        this.listenTo(view, 'destroy', this.unregister);
      }
    },

    _manageView: function (view, options) {
      if (options.loading) {
        Communicator.commands.execute('show:loading', view, options);
      } else {
        options.region.show(view);
      }
    },

    _initChildControllers: function () {
      if (!this.childControllers) {
        return;
      }

      /*
       * This way we can acccess through this.controller_name
       * instead of accessing through the childControllers
       * declaration
       */
      _.each(this.childControllers, function (controller, name) {
        this[name] = this[controller]();
      }.bind(this));
    },

    _initBusEvents: function () {
      if (!this.busEvents) {
        return;
      }

      _.each(this.busEvents, function (cb, event) {
        if (typeof(cb) === 'function') {
          Communicator.events.on(event, cb, this);
        } else {
          Communicator.events.on(event, this[cb], this);
        }
      }.bind(this));
    },

    _removeChildControllers: function () {
      if (!this.childControllers) {
        return;
      }

      _.each(this.childControllers, function (controller, name) {
        controller = this[name];
        // for controllers who load other controllers
        if (controller.mainView) {
          controller.mainView.destroy();
        }
        this[name].unregister();
      }.bind(this));
    },

    _removeBusEvents: function () {
      if (!this.busEvents) {
        return;
      }

      _.each(this.busEvents, function (cb, event) {
        if (typeof(cb) === 'function') {
          Communicator.events.off(event, cb, this);
        } else {
          Communicator.events.off(event, this[cb], this);
        }
      }.bind(this));
    }
  });

  return BaseController;
});