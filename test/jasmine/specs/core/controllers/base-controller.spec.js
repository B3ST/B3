/* global define */

define([
  'backbone',
  'controllers/base-controller',
  'buses/request-bus',
  'buses/command-bus',
  'buses/event-bus'
], function (Backbone, BaseController, RequestBus, CommandBus, EventBus) {
  'use strict';

  describe("BaseController", function() {
    var controller, Extend;

    describe("When initializing BaseController", function() {
      it("should call the initialize function if there's one", function() {
        var init = jasmine.createSpy('initialize');
        Extend = BaseController.extend({
          initialize: init
        });

        controller = new Extend({});
        expect(init).toHaveBeenCalledWith({});
      });

      it("should request for the default region if none was given", function() {
        var request = spyOn(RequestBus, 'request');
        Extend = BaseController.extend({});

        controller = new Extend({});
        expect(request).toHaveBeenCalledWith('default:region');
      });

      it("should register its controller", function() {
        var command = spyOn(CommandBus, 'execute');
        Extend = BaseController.extend({});

        controller = new Extend({});
        expect(command).toHaveBeenCalledWith('register:controller', controller, controller.instanceId);
      });

      it("should setup its child controllers if any defined", function() {
        Extend = BaseController.extend({
          childControllers: {
            'child': 'child'
          },
          child: function() {
            return {};
          }
        });

        controller = new Extend({});
        expect(controller.child).toBeDefined();
      });

      it("should setup bus events when defined", function() {
        var bus = spyOn(EventBus, 'on');
        Extend = BaseController.extend({
          busEvents: {
            'event_one': 'event',
            'event_two': function() {}
          },

          event: function() {}
        });

        controller = new Extend({});
        expect(bus).toHaveBeenCalledWith('event_one', controller.event, controller);
        expect(bus).toHaveBeenCalledWith('event_two', jasmine.any(Function), controller);
      });
    });

    describe("When displaying a view", function() {
      var view, options, region;

      beforeEach(function() {
        region = jasmine.createSpyObj('main', ['show']);
        Extend = BaseController.extend({});
        view = new Backbone.View({});
        options = {
          region: region
        };
      });

      it("should set as its mainView", function() {
        controller = new Extend(options);
        controller.show(view, {});

        expect(controller.mainView).toEqual(view);
      });

      it("should listen to the destroy event", function() {
        var listen = spyOn(Extend.prototype, 'listenTo');

        controller = new Extend(options);
        controller.show(view, {});

        expect(listen).toHaveBeenCalledWith(view, 'destroy', controller.unregister);
      });

      it("should display the given region", function() {
        controller = new Extend(options);
        controller.show(view, {});

        expect(region.show).toHaveBeenCalledWith(view);
      });

      it("should trigger a show:loading command when loading is given", function() {
        var bus = spyOn(CommandBus, 'execute');

        controller = new Extend(options);
        controller.show(view, {
          loading: true
        });

        expect(bus).toHaveBeenCalledWith('show:loading', view, {
          loading: true,
          region: region
        });
      });
    });

    describe("When unregistering a controller", function() {
      var region, options;

      beforeEach(function() {
        region = jasmine.createSpyObj('main', ['show']);
        options = {
          region: region
        };
        Extend = BaseController.extend({
          childControllers: {
            child: 'child'
          },

          busEvents: {
            'event_one': 'event',
            'event_two': function() {}
          },

          child: function() {
            return new BaseController(options);
          },

          event: function() {}
        });
      });

      it("should tear down all child controllers", function() {
        controller = new Extend(options);
        var unregister = spyOn(controller.child, 'unregister');
        controller.unregister();

        expect(unregister).toHaveBeenCalled();
      });

      it("should tear down all binded events", function() {
        var bus = spyOn(EventBus, 'off');

        controller = new Extend(options);
        controller.unregister();

        expect(bus).toHaveBeenCalledWith('event_one', controller.event, controller);
        expect(bus).toHaveBeenCalledWith('event_two', jasmine.any(Function), controller);
      });

      it("should unregister its controller", function() {
        var bus = spyOn(CommandBus, 'execute');

        controller = new Extend(options);
        controller.unregister();

        expect(bus).toHaveBeenCalledWith('unregister:controller', controller, controller.instanceId);
      });

      it("should call destroy", function() {
        var destroy = spyOn(Extend.prototype, 'destroy');

        controller = new Extend({});
        controller.unregister();

        expect(destroy).toHaveBeenCalled();
      });
    });
  });
});