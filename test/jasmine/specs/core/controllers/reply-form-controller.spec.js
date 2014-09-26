/* global define */

define([
  'jquery',
  'controllers/reply-form-controller',
  'controllers/base-controller',
  'views/reply-form-view',
  'buses/event-bus',
  'models/comment-model',
  'models/settings-model',
  'sinon'
], function ($, ReplyFormController, BaseController, ReplyFormView, EventBus, Comment, Settings) {
  'use strict';

  describe("ReplyFormController", function() {
    var options, controller;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { region: region, parentId: 1 };
    });

    it("should extend from BaseController", function() {
      expect(inherits(ReplyFormController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new ReplyFormController(options);
      expect(controller.busEvents).toEqual({
        'replyform:view:cancel': 'cancelReply',
        'replyform:view:reply':  'sendReply'
      });
    });

    describe(".showForm", function() {
      it("should display a ReplyFormView", function() {
        var show = spyOn(ReplyFormController.prototype, 'show');

        controller = new ReplyFormController(options);
        controller.showForm();

        expect(show).toHaveBeenCalledWith(jasmine.any(ReplyFormView));
      });
    });

    describe(".cancelReply", function() {
      it("should trigger a replyform:cancel", function() {
        var trigger = spyOn(EventBus, 'trigger');

        controller = new ReplyFormController(options);
        controller.cancelReply();

        expect(trigger).toHaveBeenCalledWith('replyform:cancel', { id: 1 });
      });
    });

    describe(".sendReply", function() {
      var defer = $.Deferred(), save, comment, server;

      beforeEach(function() {
        comment = {
          content:        'Some reply',
          post:           1,
          parent_comment: 0,
          author:         null
        };

        save = spyOn(Comment.prototype, 'save').and.callThrough();
        controller = new ReplyFormController(options);
        controller.mainView = jasmine.createSpyObj('view', ['destroy', 'displayWarning']);
      });

      it("should create a comment", function() {
        controller.sendReply(comment);
        expect(save).toHaveBeenCalledWith(comment);
      });

      describe("When it is successful", function() {
        beforeEach(function() {
          server = stubServer({
            verb:     'POST',
            url:      Settings.get('api_url') + '/posts/1/b3:replies/',
            code:     200,
            response: {}
          });
        });

        it("should trigger a comment:create event with the newly create comment", function() {
          var trigger = spyOn(EventBus, 'trigger');
          controller.sendReply(comment);
          server.respond();
          expect(trigger).toHaveBeenCalledWith('comment:create', jasmine.any(Comment));
        });

        it("should destroy its mainView", function() {
          controller.sendReply(comment);
          server.respond();
          expect(controller.mainView.destroy).toHaveBeenCalled();
        });
      });

      describe("When it fails", function() {
        it("should display a warning", function() {
          server = stubServer({
            verb:     'POST',
            url:      Settings.get('api_url') + '/posts/1/b3:replies/',
            code:     400,
            response: {}
          });
          controller.sendReply(comment);
          server.respond();
          expect(controller.mainView.displayWarning).toHaveBeenCalledWith('Could not reply to comment');
        });
      });
    });
  });
});
