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

      this._setupOptions(options);

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

    _setupOptions: function (options) {
      this.app   = options.app;
      this.posts = options.posts;
      this.user  = options.user;
      this.state = {};
    },

    _setMainView: function (view, options) {
      if (!this.mainView && !options.loading) {
        this.mainView = view;
        this.listenTo(view, 'destroy', this.unregister);
      }
    },

    _manageView: function (view, options) {
      if (options.loading) {
        Communicator.commands.execute('show:loading', options);
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
        controller.region.reset();
        // for controllers who load other controllers
        if (!controller.mainView) {
          this[name].unregister();
        }
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
  // return Marionette.Controller.extend({
  //   initialize: function(options) {
  //     this.app   = options.app;
  //     this.posts = options.posts;
  //     this.user  = options.user;
  //     this.state = {};

  //     if (this.postInitialize) {
  //       this.postInitialize(options);
  //     }

  //     this.bindToEvents();
  //   },

  //   bindToEvents: function () {
  //     _.bindAll(this, 'displayPost');
  //     EventBus.bind('archive:display:post', this.displayPost);
  //   },

  //   onDestroy: function () {
  //     EventBus.unbind('archive:display:post', this.displayPost);
  //   },

  //   /**
  //    * Resets the displaying state
  //    * @param  {Object} params The object containing the post
  //    */
  //   displayPost: function (params) {
  //     this.isDisplaying = false;
  //     this.state.was_displaying = false;
  //     if (this.onDisplayPost) {
  //       this.onDisplayPost(params);
  //     }
  //   },

  //   /**
  //    * Display view.
  //    *
  //    * @param {Object} view View to display.
  //    */
  //   show: function (view) {
  //     this.listenTo(view, 'destroy', function () {
  //       this.isDisplaying = false;
  //     }.bind(this));
  //     this.app.main.show(view);
  //     this.isDisplaying = true;
  //   },

  //   /**
  //    * Triggers a command to display the loading view
  //    * @param {Region} region The region to display loading
  //    */
  //   showLoading: function (region) {
  //     CommandBus.execute('loading:show', region);
  //   },

  //
  // });
});