/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'buses/command-bus',
  'buses/event-bus'
], function ($, _, Backbone, CommandBus, EventBus) {
  'use strict';

  CommandBus.setHandler('when:fetched', function (entities, done, fail) {
    var xhrs = _.chain([entities])
                .flatten()
                .pluck('fetch')
                .map(function (xhr, index) {
                  var isCollection = entities[index] instanceof Backbone.Collection;
                  return isCollection ? xhr.call(entities[index], { reset: true })
                                      : xhr.call(entities[index]);
                })
                .value();

    EventBus.trigger('fetch:start');
    $.when.apply($, xhrs).done(function () {
      EventBus.trigger('fetch:done');
      done.apply(null, arguments);
    }).fail(function () {
      EventBus.trigger('fetch:fail');
      fail();
    });
  });
});