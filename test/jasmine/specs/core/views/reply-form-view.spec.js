define([
  'views/reply-form-view',
  'controllers/event-bus',
  'models/comment-model',
  'models/post-model'
], function (ReplyFormView, EventBus, Comment, Post) {
  describe("ReplyFormView", function() {
    beforeEach(function() {
      this.parentView = jasmine.createSpyObj('parentView', ['replyRendered', 'replyDestroyed']);
      this.post       = new Post({ID: 1});
    });

    describe(".initialize", function() {
      it("should set its parent view", function() {
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView});
        expect(this.view.parentView).toEqual(this.parentView);
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView});
        this.view.render();
      });

      it("should render the template", function() {
        expect(this.view.el).toBeDefined();
      });

      it("should warn the parent view that the view was rendered", function() {
        expect(this.parentView.replyRendered).toHaveBeenCalled();
      });
    });

    describe("When clicking in cancel button", function() {
      beforeEach(function() {
        this.spy = spyOn(Backbone.Marionette.ItemView.prototype, 'destroy').andCallThrough();
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView});
        this.view.render();

        this.view.$('#b3-cancel').click();
      });

      it("should destroy the view", function() {
        expect(this.spy).toHaveBeenCalled();
      });

      it("should warn the parent view that the view was destroyed", function() {
        expect(this.parentView.replyDestroyed).toHaveBeenCalled();
      });
    });

    describe("When clicking in reply button", function() {
      beforeEach(function() {
        this.spy = spyOn(Comment.prototype, 'save');
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView});
        this.view.render();

        this.view.$('#b3-replybox').val('Some reply');
        this.view.$('#b3-replybutton').click();
      });

      it("should create a comment for the given post", function() {
        expect(this.spy).toHaveBeenCalled();
      });

      it("should warn the parent view that the view was destroyed", function() {
        expect(this.parentView.replyDestroyed).toHaveBeenCalled();
      });
    });
  });
});
