/* global define */

define([
  'jquery',
  'underscore',
  'buses/command-bus',
  'buses/event-bus'
], function ($, _, CommandBus, EventBus) {
  'use strict';

  CommandBus.setHandler('when:fetched', function (entities, done, fail) {
    var xhrs = _.chain([entities])
                .flatten()
                .pluck('fetch')
                .map(function (xhr, index) {
                  return xhr.call(entities[index], { reset: true });
                })
                .value();

    EventBus.trigger('fetch:start');
    $.when.apply($, xhrs).done(function (entities, status, jqXHR) {
      EventBus.trigger('fetch:done');
      done(entities, status, jqXHR);
    }).fail(function () {
      EventBus.trigger('fetch:fail');
      fail();
    });
  });
});