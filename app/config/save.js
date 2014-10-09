/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'buses/command-bus',
  'buses/event-bus'
], function ($, _, Backbone, CommandBus, EventBus) {
  'use strict';

  CommandBus.setHandler('when:saved', function (entities, done, fail) {
    var xhrs = _.chain([entities])
                .flatten()
                .pluck('save')
                .map(function (xhr, index) {
                  return xhr.call(entities[index]);
                })
                .value();

    EventBus.trigger('save:start');
    $.when.apply($, xhrs).done(function () {
      EventBus.trigger('save:done');
      done.apply(null, arguments);
    }).fail(function () {
      EventBus.trigger('save:fail');
      fail();
    });
  });
});