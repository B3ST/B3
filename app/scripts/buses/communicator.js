/* global define */

define([
  'buses/command-bus',
  'buses/request-bus',
  'buses/event-bus'
], function (CommandBus, RequestBus, EventBus) {
  'use strict';

  var Communicator = function () { };

  Communicator.prototype = {
    requests: RequestBus,
    events:   EventBus,
    commands: CommandBus
  };

  return new Communicator();
});