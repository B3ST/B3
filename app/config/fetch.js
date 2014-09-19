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

    EventBus.trigger('disable:controls');
    $.when.apply($, xhrs).done(function (collection, status, jqXHR) {
      done(collection, status, jqXHR);
      EventBus.trigger('enable:controls');
    }).fail(function () {
      fail();
      EventBus.trigger('enable:controls');
    });
  });
});