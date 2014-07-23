define([
  'views/content-single-view',
  'controllers/event-bus',
  'views/reply-form-view',
  'models/user-model',
  'models/post-model',
  'models/comment-model',
  'collections/comment-collection',
  'sinon'
], function (ContentSingleView, EventBus, ReplyFormView, User, Post, Comment, Comments) {
  describe("ContentSingleView", function() {
    beforeEach(function() {
      this.user = new User();
    });

    describe(".initialize", function() {
      it("should bind to a given set of events", function() {
        this.spy = spyOn(EventBus, 'bind');
        this.post = new Post({ID: 1});
        this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});

        expect(this.spy).toHaveBeenCalledWith('comment:created', this.view.addComment);
      });

      it("should fetch the corresponding post comments", function() {
        this.spy  = spyOn(Post.prototype, 'fetchComments');
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        expect(this.spy).toHaveBeenCalled();
      });

      describe("When fetching comments", function() {
        beforeEach(function() {
          this.url  = 'http://root.org/post/1/comments';
          this.post = new Post({
            ID:      1,
            title:   'Title',
            content: 'Some Content',
            meta: {
              links: {
                replies: this.url
              }
            }
          });
        });

        describe("When fetching is successful", function() {
          it("should display the comments", function() {
            var response = [
              new Comment({ID: 1, content: 'Comment content 1', status: 'approved'}).toJSON(),
              new Comment({ID: 2, content: 'Comment content 2', status: 'approved'}).toJSON()
            ];
            this.server = sinon.fakeServer.create();
            this.server.respondWith(
              'GET',
              this.url + '/',
              [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
            );

            this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
            this.view.render();

            this.server.respond();
            expect(this.view.$('.b3-comments').children().length).toEqual(2);
            expect(this.view.$('.b3-comment-content').length).toEqual(2);
          });

          describe("When there are replies to comments", function() {
            it("should nest the replies with the parent comment", function() {
              var response = [
                new Comment({ID: 1, content: 'Comment content 1', status: 'approved'}).toJSON(),
                new Comment({ID: 2, content: 'Comment content 2', status: 'approved'}).toJSON(),
                new Comment({ID: 3, content: 'Comment 1 reply 1', status: 'approved', parent: 1}).toJSON(),
                new Comment({ID: 4, content: 'Comment 1 reply 2', status: 'approved', parent: 1}).toJSON(),
                new Comment({ID: 5, content: 'Comment 2 reply 2', status: 'approved', parent: 2}).toJSON(),
                new Comment({ID: 6, content: 'Reply 1 reply 1', status: 'approved', parent: 3}).toJSON(),
                new Comment({ID: 7, content: 'Reply 2 reply 1', status: 'approved', parent: 3}).toJSON(),
                new Comment({ID: 8, content: 'Reply 1 reply 2', status: 'approved', parent: 5}).toJSON()
              ];

              this.server = sinon.fakeServer.create();
              this.server.respondWith(
                'GET',
                this.url + '/',
                [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
              );

              this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
              this.view.render();

              this.server.respond();
              expect(this.view.$('.b3-comments').children().length).toEqual(8);
              expect(this.view.$('.b3-comment-content').length).toEqual(8);

              expect(this.view.$('#comment-1 > ul.b3-comments').children().length).toEqual(2);
              expect(this.view.$('#comment-2 > ul.b3-comments').children().length).toEqual(1);

              expect(this.view.$('#comment-3 > ul.b3-comments').children().length).toEqual(2);
              expect(this.view.$('#comment-5 > ul.b3-comments').children().length).toEqual(1);
            });
          });
        });

        describe("When fetching fails", function() {
          it("should display an error", function() {
            var response = '';
            this.server = sinon.fakeServer.create();
            this.server.respondWith(
              'GET',
              this.url,
              [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
            );
            this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
            this.view.render();

            this.server.respond();
            expect(this.view.$('.b3-comments').text()).not.toEqual('');
          });
        });
      });
    });

    describe(".addComment", function() {
      beforeEach(function() {
        this.comment = new Comment({"ID":59,"post":1,"content":"<p>reply to the post<\/p>\n","status":"approved","type":"comment","parent":0,"author":1,"date": new Date(),"date_tz":"UTC","date_gmt": new Date(),"meta":{"links":{"up":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:comments\/59"}}});
        this.spy     = spyOn(ContentSingleView.prototype, 'render').andCallThrough();
        this.post    = new Post({ID: 1});
        this.view    = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
      });

      it("should add to its collection", function() {
        this.view.addComment(this.comment);
        expect(this.view.collection.length).toEqual(1);
      });

      it("should re-render the view", function() {
        this.view.addComment(this.comment);
        expect(this.spy).toHaveBeenCalled();
      });
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        expect(this.view.el).toBeDefined();
      });
    });

    describe("When replying to the post", function() {
      it("should display a comment box", function() {
        this.post = new Post({ID: 1});
        this.view = new ContentSingleView({model: this.post, collection: new Comments(), user: this.user});
        this.view.render();

        this.view.$('.b3-reply-post').click();

        var template = new ReplyFormView({parentView: this.view, user: this.user}).render().el;
        var box      = this.view.$('.b3-reply-section').children()[0];
        expect(box.isEqualNode(template)).toBeTruthy();
      });
    });

    describe("When post content has multiple pages", function() {
      beforeEach(function() {
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Page 1<!--nextpage-->Page 2<!--nextpage-->Page 3'
        });
        this.view = new ContentSingleView({model: this.post, collection: new Comments()});
        this.view.render();
      });

      it("should split the post into multiple pages", function() {
        expect(this.view.$('.b3-post-content').text()).toEqual('Page 1');
      });

      it("should display next page control and hide previous page control", function() {
        expect(this.view.$('.pagination-next').length).toEqual(1);
        expect(this.view.$('.pagination-prev').parent().attr('class')).toContain('disabled');
      });

      describe("When clicking in the next page", function() {
        it("should display the next page", function() {
          this.view.$('.pagination-next').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 2');
        });
      });

      describe("When clicking in the previous page", function() {
        it("should display the previous page", function() {
          this.view = new ContentSingleView({model: this.post, collection: new Comments()});
          this.view.page = 2;
          this.view.render();

          this.view.$('.pagination-prev').click();
          expect(this.view.$('.b3-post-content').text()).toEqual('Page 2');
        });
      });
    });
  });
});
