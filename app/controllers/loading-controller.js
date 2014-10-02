/* global define */

define([
  'jquery',
  'underscore',
  'controllers/base-controller',
  'views/loading-view',
  'buses/command-bus'
], function ($, _, BaseController, LoadingView, CommandBus) {
  'use strict';

  var LoadingController = BaseController.extend({
    busEvents: {
      'fetch:done': 'closeLoading',
    },

    style: {
      none: function () {
        // do nothing
      },

      loading: function (options) {
        this.show(new LoadingView({ title: options.title }), options);
      },

      opacity: function (options) {
        options.region.$el.addClass('opacity');
        $('body,html').animate({ scrollTop: 0 }, 800);
      }
    },

    initialize: function (options) {
      var config = options.config === true ? {} : options.config;

      this.view = options.view;
      _.defaults(config, this._getDefaults(options.options));

      this._bindCommand();
      this._showLoading(config, options.options);
      this._fetchEntities(this.view, config);
    },

    closeLoading: function () {
      this.region.$el.removeClass('opacity');
      if (!this.view) {
        this.unregister();
      }
    },

    /**
     * Display the current progress
     * @param  {Object} data An object containing the current progress (total and loaded)
     */
    displayProgress: function (data) {
      if (this.mainView) {
        this.mainView.progress(data);
      }
    },

    _bindCommand: function () {
      CommandBus.setHandler('loading:progress', this.displayProgress, this);
    },

    _showLoading: function (config, options) {
      if (this.style.hasOwnProperty(config.style)) {
        this.style[config.style].bind(this)(options);
      }
    },

    _fetchEntities: function (view, config) {
      CommandBus.execute('when:fetched', config.entities, config.done, config.fail);
    },

    _getDefaults: function (options) {
      return {
        entities:  this._getEntities(this.view),
        operation: 'fetch',
        style:     'loading',

        done: function () {
          if (this.view) {
            this.show(this.view, { region: options.region });
          }
        }.bind(this),

        fail: function () {}
      };
    },

    _getEntities: function (view) {
      return _.chain(view).pick('model', 'collection')
                          .toArray()
                          .compact()
                          .value();
    }
  });

  CommandBus.setHandler('show:loading', function (view, options) {
    new LoadingController({
      view:    view,
      options: { region: options.region, title: options.title },
      config:  options.loading
    });
  });

  return LoadingController;
});