define([
  'models/post-status-model',
  'sinon'
], function (PostStatus) {
  describe("PostStatus", function() {
    beforeEach(function() {
      this.model = new PostStatus();
    });

    describe("When initializing a PostStatus", function() {
      it("should have an empty name", function() {
        expect(this.model.get('name')).toBe('');
      });

      it("should have a null slug", function() {
        expect(this.model.get('slug')).toBeNull();
      });

      it("should have empty meta fields", function() {
        expect(this.model.get('meta')).toEqual({});
      });

      using('model fields', ['public', 'queryable', 'show_in_list'], function (field) {
        it("should have " + field + " set to true", function() {
          expect(this.model.get(field)).toBeTruthy();
        });
      });

      using('model', ['protected', 'private'], function (field) {
        it("should have " + field + " set to false", function() {
          expect(this.model.get(field)).toBeFalsy();
        });
      });
    });

    describe("When fetching post statuses", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.model  = new PostStatus({slug: 'publish'});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set to the given model", function() {
          var response = {"name":"Published","slug":"publish","public":true,"protected":false,"private":false,"queryable":true,"show_in_list":true,"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/statuses\/publish","up":"http:\/\/example.com\/wp-json\/posts\/statuses"}}};

          this.server.respondWith(
            'GET',
            '/posts/statuses/publish',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('name')).toEqual('Published');
          expect(this.model.get('public')).toBeTruthy();
          expect(this.model.get('private')).toBeFalsy();
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its values", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            '/posts/statuses/publish',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new PostStatus({slug: 'publish'});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });
  });
});
