define([
  'views/reply-form-view',
  'controllers/event-bus',
  'models/settings-model',
  'models/user-model',
  'models/comment-model',
  'models/post-model',
  'sinon'
], function (ReplyFormView, EventBus, Settings, User, Comment, Post) {
  describe("ReplyFormView", function() {
    beforeEach(function() {
      this.parentView = jasmine.createSpyObj('parentView', ['replyRendered', 'replyDestroyed']);
      this.user       = new User({ID: 1, email: 'email', name: 'name'});
      this.post       = new Post({ID: 1});
    });

    describe(".initialize", function() {
      it("should set its parent view", function() {
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user});
        expect(this.view.parentView).toEqual(this.parentView);
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user});
        this.view.render();
      });

      it("should render the template", function() {
        expect(this.view.el).toBeDefined();
      });

      it("should warn the parent view that the view was rendered", function() {
        expect(this.parentView.replyRendered).toHaveBeenCalled();
      });

      describe("When user is logged in", function() {
        it("should hide the form for name and user email", function() {
          this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user});
          this.view.render();

          expect(this.view.$('#b3-author').length).toEqual(0);
        });
      });

      describe("When user is not logged in", function() {
        it("should display a form for name and user email", function() {
          this.user = new User();
          this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user});
          this.view.render();

          expect(this.view.$('#b3-author').length).toEqual(1);
        });
      });
    });

    describe("When clicking in cancel button", function() {
      beforeEach(function() {
        this.spy = spyOn(Backbone.Marionette.ItemView.prototype, 'destroy').andCallThrough();
        this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user:this.user});
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
        this.requests = [];
        this.xhr = sinon.useFakeXMLHttpRequest();
        this.xhr.onCreate = $.proxy(function(xhr) {
            this.requests.push(xhr);
        }, this);


        this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user, parentId: 0});
        this.view.render();

        this.view.$('#b3-replybox').val('Some reply');
      });

      afterEach(function() {
        this.xhr.restore();
      });

      it("should warn the parent view that the view was destroyed", function() {
        this.view.$('#b3-replybutton').click();
        expect(this.parentView.replyDestroyed).toHaveBeenCalled();
      });

      describe("When user is logged in", function() {
        it("should create a comment for the given post associated with that user", function() {
          var comment = new Comment({
            content:        'Some reply',
            post:           this.post.get('ID'),
            parent_comment: 0,
            author:         this.user
          });
          this.view.$('#b3-replybutton').click();
          expect(JSON.parse(this.requests[0].requestBody)).toEqual(comment.toJSON());
        });

        describe("When there is no reply", function() {
          beforeEach(function() {
            this.view.$('#b3-replybox').val('');
            this.view.$('#b3-replybutton').click();
          });

          it("should not create a comment", function() {
            expect(this.requests.length).toEqual(0);
          });

          it("should display a warning", function() {
            expect(this.view.$('#b3-warning').text()).not.toEqual('');
          });
        });
      });

      describe("When user is not logged in", function() {
        beforeEach(function() {
          this.user = new User();
          this.view = new ReplyFormView({model: this.post, parentView: this.parentView, user: this.user, parentId: 0});
          this.view.render();

          this.view.$('#b3-replybox').val('Some reply');
          this.view.$('#b3-author-name').val('Author Name');
          this.view.$('#b3-author-email').val('author@email.com');
        });

        it("should create a comment with the given name and email", function() {
          var user = new User({name: 'Author Name', email: 'author@email.com'});
          var comment = new Comment({
            content:        'Some reply',
            post:           this.post.get('ID'),
            parent_comment: 0,
            author:         user
          });

          this.view.$('#b3-replybutton').click();
          expect(JSON.parse(this.requests[0].requestBody)).toEqual(comment.toJSON());
        });

        using('view fields', ['#b3-author-name', '#b3-author-email'], function (field) {
          describe("When " + field + " is missing", function() {
            beforeEach(function() {
              this.view.$('#b3-replybox').val('Some reply');

              this.view.$(field).val('');
              this.view.$('#b3-replybutton').click();
            });

            it("should not create a comment", function() {
              expect(this.requests.length).toEqual(0);
            });

            it("should display a warning", function() {
              expect(this.view.$('#b3-warning').text()).not.toEqual('');
            });
          });
        });
      });
    });
  });
});
