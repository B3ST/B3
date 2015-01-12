/* global define */

define([
  'controllers/reply-form-controller',
  'controllers/base-controller',
  'views/reply-form-view',
  'buses/event-bus',
  'models/comment-model',
  'models/settings-model'
], function (ReplyFormController, BaseController, ReplyFormView, EventBus, Comment, Settings) {
  'use strict';

  describe('ReplyFormController', function() {
    var options, controller;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { region: region, parentId: 1 };
    });

    it('should extend from BaseController', function() {
      expect(inherits(ReplyFormController, BaseController)).toBeTruthy();
    });

    it('should bind to a given set of events', function() {
      controller = new ReplyFormController(options);
      expect(controller.busEvents).toEqual({
        'replyform:view:cancel': 'cancelReply',
        'replyform:view:reply':  'sendReply'
      });
    });

    describe('.showForm', function() {
      it('should display a ReplyFormView', function() {
        var show = spyOn(ReplyFormController.prototype, 'show');

        controller = new ReplyFormController(options);
        controller.showForm();

        expect(show).toHaveBeenCalledWith(jasmine.any(ReplyFormView));
      });
    });

    describe('.cancelReply', function() {
      it('should trigger a replyform:cancel', function() {
        var trigger = spyOn(EventBus, 'trigger');

        controller = new ReplyFormController(options);
        controller.cancelReply();

        expect(trigger).toHaveBeenCalledWith('replyform:cancel', { id: 1 });
      });
    });

    describe('.sendReply', function() {
      var comment, show;

      beforeEach(function() {
        comment = {
          content:        'Some reply',
          post:           1,
          parent_comment: 0,
          author:         null
        };

        show = spyOn(ReplyFormController.prototype, 'show');
        controller = new ReplyFormController(options);
        controller.mainView = jasmine.createSpyObj('view', ['destroy', 'displayWarning']);
      });

      it('should save the comment', function() {
        controller.sendReply(comment);
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            operation: 'save',
            entities:  [jasmine.any(Comment)],
            style:     'opacity',
            done:      jasmine.any(Function),
            fail:      jasmine.any(Function)
          }
        });
      });

      describe('When it is successful', function() {
        var trigger;
        beforeEach(function() {
          trigger = spyOn(EventBus, 'trigger');
          show.and.callFake(function (view, options) {
            options.loading.done();
          });
        });

        it('should trigger a comment:create event with the newly create comment', function() {
          controller.sendReply(comment);
          expect(trigger).toHaveBeenCalledWith('comment:create', jasmine.any(Comment));
        });

        it('should destroy its mainView', function() {
          controller.sendReply(comment);
          expect(controller.mainView.destroy).toHaveBeenCalled();
        });
      });

      describe('When it fails', function() {
        it('should display a warning', function() {
          show.and.callFake(function (view, options) {
            options.loading.fail({ responseJSON: [{ message: 'Could not reply to comment' }]});
          });
          controller.sendReply(comment);
          expect(controller.mainView.displayWarning).toHaveBeenCalledWith('Could not reply to comment');
        });
      });
    });
  });
});
