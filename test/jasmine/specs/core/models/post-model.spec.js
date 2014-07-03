define([
  'models/post-model',
  'sinon'
], function (Post) {
  describe("Post", function() {
    describe("When instantiating a Post", function() {
      beforeEach(function() {
        this.model = new Post();
      });
      using('model fields', ['ID', 'featured_image'], function(field) {
        it("should have a null " + field, function() {
          expect(this.model.get(field)).toBe(null);
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt', 'date', 'date_gmt', 'modified'], function(field) {
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

      using('model fields', ['author', 'terms', 'post_meta', 'meta'], function(field) {
        it("should have an empty object for " + field, function() {
          expect(this.model.get(field)).toEqual({});
        });
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

    describe(".getAuthor", function() {
      it("should return a User model of author", function() {
        this.post   = new Post({author: {"ID":1,"username":"admin","name":"admin","first_name":"","last_name":"","nickname":"admin","slug":"admin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b17c1f19d80bf8f61c3f14962153f959?s=96","description":"","email":"admin@example.com","registered":"2014-03-05T18:37:51+00:00","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}}});
        this.author = this.post.getAuthor();

        expect(this.author.get('ID')).toBe(1);
        expect(this.author.get('username')).toBe('admin');
        expect(this.author.get('email')).toBe('admin@example.com');
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
          var response = JSON.parse('{"ID":1,"title":"Test Post","status":"publish","type":"page","author":{"ID":1,"username":"admin","name":"admin","first_name":"","last_name":"","nickname":"admin","slug":"admin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b17c1f19d80bf8f61c3f14962153f959?s=96","description":"","email":"admin@example.com","registered":"2014-03-05T18:37:51+00:00","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"","parent":0,"link":"http:\/\/example.com\/test-post-2\/","date":"2014-05-11T19:29:15+00:00","modified":"2014-05-11T19:29:15+00:00","format":"standard","slug":"test-post-2","guid":"http:\/\/example.com\/test-post-2\/","excerpt":null,"menu_order":1,"comment_status":"closed","ping_status":"closed","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-11T19:29:15+00:00","modified_tz":"UTC","modified_gmt":"2014-05-11T19:29:15+00:00","password":"","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts","replies":"http:\/\/example.com\/wp-json\/posts\/1\/comments","version-history":"http:\/\/example.com\/wp-json\/posts\/1\/revisions"}},"featured_image":null,"terms":[]}');

          this.server.respondWith(
            'GET',
            '/wp-json/posts/1',
            [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.post.fetch();
          this.server.respond();

          expect(this.post.get('ID')).toBe(1);
          expect(this.post.get('title')).toBe('Test Post');

          expect(this.post.getAuthor().get('username')).toBe('admin');
          expect(this.post.getAuthor().get('ID')).toBe(1);

          expect(this.post.get('date')).toBe('2014-05-11T19:29:15+00:00');
          expect(this.post.get('modified')).toBe('2014-05-11T19:29:15+00:00');
        });
      });

      describe("When fetching fails", function() {
        it("should set to default attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            '/wp-json/posts/1',
            [404, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.post.fetch();
          this.server.respond();

          var empty = new Post();
          expect(this.post.defaults).toEqual(empty.attributes);
        });
      });
    });
  });
});
