/* global define */

define([
  'collections/base-collection',
  'buses/event-bus'
], function (BaseCollection, EventBus) {
  'use strict';

  describe("BaseCollection", function() {
    var test,
        Test = BaseCollection.extend({
          heartbeat: 'heartbeat:comments'
        });

    describe("When the heartbeat attribute is defined", function() {
      it("should bind to that event", function() {
        var bus = spyOn(EventBus, 'on');
        test = new Test();

        expect(bus).toHaveBeenCalledWith(test.heartbeat, test.onHeartbeat, test);
      });
    });

    describe(".onHeartbeat", function() {
      it("should refresh the collection", function() {
        var fetch = spyOn(Test.prototype, 'fetch');

        test = new Test();
        test.onHeartbeat({ 'heartbeat:comments': [101] });

        expect(fetch).toHaveBeenCalledWith({ reset: true });
      });
    });

    describe(".stopHeartbeat", function() {
      it("should disable the heartbeat", function() {
        var bus = spyOn(EventBus, 'off');

        test = new Test();
        test.stopHeartbeat();

        expect(bus).toHaveBeenCalledWith(test.heartbeat, test.onHeartbeat, test);
      });
    });
  });
});