define([
  'models/post-model',
  'models/settings-model',
  'sinon'
], function (Post, Settings) {
  describe("Post", function() {
    describe("When instantiating a Post", function() {
      beforeEach(function() {
        this.model = new Post();
      });

      using('model fields', ['ID', 'featured_image'], function(field) {
        it("should have a null " + field, function() {
          expect(this.model.get(field)).toBeNull();
        });
      });

      using('model fields', ['author', 'date', 'date_gmt', 'modified'], function (field) {
        it("should have " + field + " defined", function() {
          expect(this.model.get(field)).toBeDefined();
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt'], function(field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toBe('');
        });
      });

      using('model fields', ['comment_status', 'ping_status'], function(field) {
        it("should have " + field + " open", function() {
          expect(this.model.get(field)).toBe('open');
        });
      });

      using('model fields', ['date_tz', 'modified_tz'], function(field) {
        it("should set " + field + " to Etc/UTC", function() {
          expect(this.model.get(field)).toBe('Etc/UTC');
        });
      });

      using('model fields', ['terms', 'post_meta', 'meta'], function(field) {
        it("should have an empty object for " + field, function() {
          expect(this.model.get(field)).toEqual({});
        });
      });

      it("should not be a parent", function() {
        expect(this.model.get('parent')).toEqual(0);
      });

      it("should have draft set for status", function() {
        expect(this.model.get('status')).toBe('draft');
      });

      it("should have post set for type", function() {
        expect(this.model.get('type')).toBe('post');
      });

      it("should not be a sticky", function() {
        expect(this.model.get('sticky')).toBeFalsy();
      });

      it("should have a standard format", function() {
        expect(this.model.get('format')).toBe('standard');
      });

      it("should have no menu_order", function() {
        expect(this.model.get('menu_order')).toBe(0);
      });
    });

    describe("When fetching a Post", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.post   = new Post({ID: 1});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"ID":1,"title":"Test Post","status":"publish","type":"page","author":{"ID":1,"username":"admin","name":"admin","first_name":"","last_name":"","nickname":"admin","slug":"admin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b17c1f19d80bf8f61c3f14962153f959?s=96","description":"","email":"admin@example.com","registered":"2014-03-05T18:37:51.000Z","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"","parent":0,"link":"http:\/\/example.com\/test-post-2\/","date":"2014-05-11T19:29:15.000Z","modified":"2014-05-11T19:29:15.000Z","format":"standard","slug":"test-post-2","guid":"http:\/\/example.com\/test-post-2\/","excerpt":null,"menu_order":1,"comment_status":"closed","ping_status":"closed","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-11T19:29:15.000Z","modified_tz":"UTC","modified_gmt":"2014-05-11T19:29:15.000Z","password":"","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts","replies":"http:\/\/example.com\/wp-json\/posts\/1\/comments","version-history":"http:\/\/example.com\/wp-json\/posts\/1\/revisions"}},"featured_image":null,"terms":[]};

          this.server.respondWith(
            'GET',
            Settings.get('apiUrl') + '/posts/1',
            [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.post.fetch();
          this.server.respond();

          expect(this.post.get('ID')).toBe(1);
          expect(this.post.get('title')).toBe('Test Post');

          expect(this.post.get('author').get('username')).toBe('admin');
          expect(this.post.get('author').get('ID')).toBe(1);

          expect(this.post.get('date')).toEqual(new Date('2014-05-11T19:29:15.000Z'));
          expect(this.post.get('modified')).toEqual(new Date('2014-05-11T19:29:15.000Z'));
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('apiUrl') + '/posts/1',
            [404, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.post.fetch();
          this.server.respond();

          var empty = new Post({ID: 1});
          expect(this.post.attributes).toEqual(empty.attributes);
        });
      });
    });

    describe("When fetching post revisions", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.post   = new Post({"ID":1,"title":"Test Post","status":"publish","type":"page","author":{"ID":1,"username":"admin","name":"admin","first_name":"","last_name":"","nickname":"admin","slug":"admin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b17c1f19d80bf8f61c3f14962153f959?s=96","description":"","email":"admin@example.com","registered":"2014-03-05T18:37:51.000Z","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"","parent":0,"link":"http:\/\/example.com\/test-post-2\/","date":"2014-05-11T19:29:15.000Z","modified":"2014-05-11T19:29:15.000Z","format":"standard","slug":"test-post-2","guid":"http:\/\/example.com\/test-post-2\/","excerpt":null,"menu_order":1,"comment_status":"closed","ping_status":"closed","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-11T19:29:15.000Z","modified_tz":"UTC","modified_gmt":"2014-05-11T19:29:15.000Z","password":"","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts","replies":"http:\/\/example.com\/wp-json\/posts\/1\/comments","version-history":"http:\/\/example.com\/wp-json\/posts\/1\/revisions"}},"featured_image":null,"terms":[]});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching post revisions is successful", function() {
        it("should return the revision collection", function() {
          var response = [
            {"ID":2,"post": 1,"title":"test","status":"inherit","type":"revision","author":{"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"admin","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14.000Z","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}, "email":"", "password":""},"content":"Revision content","parent":0,"link":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","date":"2014-05-28T00:55:04.000Z","modified":"2014-05-28T00:55:04.000Z","format":"standard","slug":"1-revision-v1","guid":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","excerpt":"This is the excerpt","menu_order":0,"comment_status":"closed","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-28T00:55:04.000Z","modified_tz":"UTC","modified_gmt":"2014-05-28T00:55:04.000Z","password":"","title_raw":"test","content_raw":"sdfsdfsf sdfsfdsf","excerpt_raw":"","guid_raw":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","post_meta":[],"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1/revisions/2","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts/1/revisions","up":"http:\/\/example.com\/wp-json\/posts\/1"}},"terms":[]}
          ];

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/revisions/',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchRevisions({
            done: function (data) {
              expect(data.models[0].get('title')).toEqual(response[0].title);
              expect(data.models[0].get('author').attributes).toEqual(response[0].author);
            }
          });

          this.server.respond();
        });
      });

      describe("When fetching a single post revision is successful", function() {
        it("should return the revision collection", function() {
          var response = {"ID":2, "post": 1, "title":"test","status":"inherit","type":"revision","author":{"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"admin","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14.000Z","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}, "email": "", "password": ""},"content":"Revision content","parent":0,"link":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","date":"2014-05-28T00:55:04.000Z","modified":"2014-05-28T00:55:04.000Z","format":"standard","slug":"1-revision-v1","guid":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","excerpt":"This is the excerpt","menu_order":0,"comment_status":"closed","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-28T00:55:04.000Z","modified_tz":"UTC","modified_gmt":"2014-05-28T00:55:04.000Z","password":"","title_raw":"test","content_raw":"sdfsdfsf sdfsfdsf","excerpt_raw":"","guid_raw":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","post_meta":[],"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1/revisions/2","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts/1/revisions","up":"http:\/\/example.com\/wp-json\/posts\/1"}},"terms":[]};
          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/revisions/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchRevisions({
            done: function (data) {
              expect(data.get('title')).toEqual(response.title);
              expect(data.get('author').attributes).toEqual(response.author);
            }
          }, 1);

          this.server.respond();
        });
      });

      describe("When fetching fails", function() {
        it("should flag an error", function() {
          var response = '';
          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/revisions/',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchRevisions({
            done: function (data) { expect(false).toBeTruthy(); },
            fail: function (data) { expect(data).not.toEqual({}) }
          });

          this.server.respond();
        });
      });

      describe("When Post is not defined", function() {
        it("should return false", function() {
          this.model = new Post({ID: 1});
          expect(this.model.fetchRevisions()).toBeFalsy();
        });
      });
    });

    describe("When fetching post comments", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.post   = new Post({"ID":1,"title":"Test Post","status":"publish","type":"page","author":{"ID":1,"username":"admin","name":"admin","first_name":"","last_name":"","nickname":"admin","slug":"admin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b17c1f19d80bf8f61c3f14962153f959?s=96","description":"","email":"admin@example.com","registered":"2014-03-05T18:37:51.000Z","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"","parent":0,"link":"http:\/\/example.com\/test-post-2\/","date":"2014-05-11T19:29:15.000Z","modified":"2014-05-11T19:29:15.000Z","format":"standard","slug":"test-post-2","guid":"http:\/\/example.com\/test-post-2\/","excerpt":null,"menu_order":1,"comment_status":"closed","ping_status":"closed","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-11T19:29:15.000Z","modified_tz":"UTC","modified_gmt":"2014-05-11T19:29:15.000Z","password":"","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts","replies":"http:\/\/example.com\/wp-json\/posts\/1\/comments","version-history":"http:\/\/example.com\/wp-json\/posts\/1\/revisions"}},"featured_image":null,"terms":[]});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching post comments is successful", function() {
        it("should return the comment collection", function() {
          var response = [
            {"ID":1,"post":1,"content":"Here is a test comment","status":"approved", "type":"comment","parent":0,"author":{"ID":1,"username":"wordpress","email":"generic@wordpress.org","password":"","name":"WordPress","first_name":"Word","last_name":"Press","nickname":"The WordPresser","slug":"wordpress","URL":"http://wordpress.org","avatar":"http://s.w.org/style/images/wp-header-logo-2x.png?1","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"date":"2014-05-22T04:57:25.000Z","date_tz":"UTC","date_gmt":"2014-05-22T04:57:25.000Z","meta":{"links":{"up":"http://example.com/wp-json/posts/1","self":"http://example.com/wp-json/posts/1/comments/2"}}}
          ];

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/comments/',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchComments({
            done: function (data) {
              expect(data.models[0].get('title')).toEqual(response[0].title);
              expect(data.models[0].get('author').attributes).toEqual(response[0].author);
            }
          });

          this.server.respond();
        });
      });

      describe("When fetching a single post comment is successful", function() {
        it("should return the single comment", function() {
          var response = {"ID":1,"post":1,"content":"Here is a test comment","status":"approved","type":"comment","parent":0,"author":{"ID":1,"username":"wordpress","email":"generic@wordpress.org","password":"","name":"WordPress","first_name":"Word","last_name":"Press","nickname":"The WordPresser","slug":"wordpress","URL":"http://wordpress.org","avatar":"http://s.w.org/style/images/wp-header-logo-2x.png?1","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"date":"2014-05-22T04:57:25.000Z","date_tz":"UTC","date_gmt":"2014-05-22T04:57:25.000Z","meta":{"links":{"up":"http://example.com/wp-json/posts/1","self":"http://example.com/wp-json/posts/1/comments/2"}}}

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/comments/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchComments({
            done: function (data) {
              expect(data.get('title')).toEqual(response.title);
              expect(data.get('author').attributes).toEqual(response.author);
            }
          }, 1);

          this.server.respond();
        });
      });

      describe("When fetching posts fails", function() {
        it("should flag an error", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/posts/1/comments/',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.post.fetchComments( {
            done: function (data) { expect(false).toBeTruthy(); },
            fail: function (data) { expect(data).not.toEqual({}); }
          });

          this.server.respond();
        });
      });

      describe("When Post is not defined", function() {
        it("should return false", function() {
          this.model = new Post({ID: 1});
          expect(this.model.fetchComments()).toBeFalsy();
        });
      });
    });
  });
});
