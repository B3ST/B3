define([
  'models/comment-model',
  'models/user-model',
  'models/settings-model',
  'sinon'
], function (Comment, User, Settings) {
  describe("Comment", function() {
    beforeEach(function() {
      this.model = new Comment();
    });

    describe("When initializing a Comment", function() {
      it("should have a hold status", function() {
        expect(this.model.get('status')).toEqual('hold');
      });

      it("should have author defined", function() {
        expect(this.model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have empty meta", function() {
        expect(this.model.get('meta')).toEqual({});
      });

      it("should have no parent", function() {
        expect(this.model.get('parent')).toEqual(0);
      });

      using('model fields', ['ID', 'post'], function (field) {
        it("should have a null " + field, function() {
          expect(this.model.get(field)).toBeNull();
        });
      });

      using('model fields', ['date', 'date_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(this.model.get(field) instanceof Date).toBeTruthy();
        });
      });

      using('model fields', ['content', 'type'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });
    });

    describe("When fetching a Comment", function() {
      beforeEach(function() {
        this.model  = new Comment({ID: 1, post: 1});
        this.server = sinon.fakeServer.create();
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"ID":1,"post":1,"content":"Here is a test comment","status":"approved","type":"comment","parent":0,"author":{"ID":1,"username":"wordpress","email":"generic@wordpress.org","password":"","name":"WordPress","first_name":"Word","last_name":"Press","nickname":"The WordPresser","slug":"wordpress","URL":"http://wordpress.org","avatar":"http://s.w.org/style/images/wp-header-logo-2x.png?1","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"date":"2014-05-22T04:57:25+00:00","date_tz":"UTC","date_gmt":"2014-05-22T04:57:25+00:00","meta":{"links":{"up":"http://example.com/wp-json/posts/1","self":"http://example.com/wp-json/posts/1/comments/2"}}};

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/1/b3:replies/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('content')).toEqual('Here is a test comment');
          expect(this.model.get('author').get('username')).toEqual('wordpress');
          expect(this.model.get('author').get('ID')).toEqual(1);
          expect(this.model.get('date')).toEqual(new Date('2014-05-22T04:57:25+00:00'));
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/1/b3:replies/1',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new Comment({ID: 1, post: 1});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });

      describe("When fetching parent", function() {
        it("should set its attributes", function() {
          var user = {
            ID: 1,
            username: 'wordpress',
            email: 'generic@wordpress.org',
            password: '',
            name: 'WordPress',
            first_name: 'Word',
            last_name: 'Press',
            nickname: 'The WordPresser',
            slug: 'wordpress',
            URL: 'http://wordpress.org',
            avatar: 'http://s.w.org/style/images/wp-header-logo-2x.png?1'
          };

          this.model = new Comment({
            ID: 2,
            post: 1,
            content: 'Here is a super test comment',
            status: 'approved',
            type: 'comment',
            parent: 1,
            author: new User(user),
            date: new Date(),
            date_tz: 'Etc/UTC',
            date_gmt: new Date(),
            meta: {
              links: {
                up: 'http://example.com/wp-json/posts/1',
                self: 'http://example.com/wp-json/posts/1/comments/2'
              }
            }
          });

          var response = {"ID":1,"post":1,"content":"Here is a test comment","status":"approved","type":"comment","parent":0,"author":{"ID":1,"username":"wordpress","email":"generic@wordpress.org","password":"","name":"WordPress","first_name":"Word","last_name":"Press","nickname":"The WordPresser","slug":"wordpress","URL":"http://wordpress.org","avatar":"http://s.w.org/style/images/wp-header-logo-2x.png?1","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"date":"2014-05-22T04:57:25+00:00","date_tz":"UTC","date_gmt":"2014-05-22T04:57:25+00:00","meta":{"links":{"up":"http://example.com/wp-json/posts/1","self":"http://example.com/wp-json/posts/1/comments/2"}}};

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/1/b3:replies/1',
            [ 200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );
          var parent = this.model.parent();
          this.server.respond();

          expect(parent.get('ID')).toEqual(1);
          expect(parent.get('content')).toEqual('Here is a test comment');
        });
      });
    });
  });
});
