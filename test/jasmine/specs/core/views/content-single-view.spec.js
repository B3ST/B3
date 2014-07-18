define([
  'views/content-single-view',
  'models/post-model',
  'models/comment-model',
  'collections/comment-collection',
  'sinon'
], function (ContentSingleView, Post, Comment, Comments) {
  describe("ContentSingleView", function() {
    describe(".initialize", function() {
      it("should fetch the corresponding post comments", function() {
        this.spy  = spyOn(Post.prototype, 'fetchComments');
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new ContentSingleView({model: this.post, collection: new Comments()});
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

            this.view = new ContentSingleView({model: this.post, collection: new Comments()});
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

              this.view = new ContentSingleView({model: this.post, collection: new Comments()});
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

            this.view = new ContentSingleView({model: this.post, collection: new Comments()});
            this.view.render();

            this.server.respond();
            expect(this.view.$('#b3-error')).not.toBeNull();
          });
        });
      });
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.post = new Post({
          ID:      1,
          title:   'Title',
          content: 'Some Content'
        });
        this.view = new ContentSingleView({model: this.post, collection: new Comments()});
        this.view.render();

        expect(this.view.el).toBeDefined();
      });
    });
  });
});