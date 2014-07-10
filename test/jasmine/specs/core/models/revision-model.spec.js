define([
  'models/revision-model',
  'models/settings-model',
  'sinon'
], function (Revision, Settings) {
  describe("Revision", function() {
    describe("When initializing Revision", function() {
      beforeEach(function() {
        this.model = new Revision();
      });

      using('model fields', ['ID', 'post', 'slug'], function (field) {
        it("should have null " + field, function() {
          expect(this.model.get(field)).toBeNull();
        });
      });

      using('model fields', ['title', 'content', 'link', 'guid', 'excerpt'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });

      using('model fields', ['parent', 'menu_order'], function (field) {
        it("should have default " + field + " as 0", function() {
          expect(this.model.get(field)).toEqual(0);
        });
      });

      using('model fields', ['date', 'modified', 'date_gmt', 'modified_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(this.model.get(field) instanceof Date).toBeTruthy();
        });
      });

      it("should have an author defined", function() {
        expect(this.model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have an empty meta object", function() {
        expect(this.model.get('meta')).toEqual({});
      });

      it("should have a standard format", function() {
        expect(this.model.get('format')).toEqual('standard');
      });

      it("should have a inherit status", function() {
        expect(this.model.get('status')).toEqual('inherit');
      });

      it("should have a revision type", function() {
        expect(this.model.get('type')).toEqual('revision');
      });
    });

    describe("When fetching a Revision", function() {
      beforeEach(function() {
        this.model  = new Revision({ID: 1, post: 1});
        this.server = sinon.fakeServer.create();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"ID":1, "post": 1, "title":"test","status":"inherit","type":"revision","author":{"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"admin","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14+00:00","meta":{"links":{"self":"http:\/\/example.com\/wp-json\/users\/1","archives":"http:\/\/example.com\/wp-json\/users\/1\/posts"}}},"content":"Revision content","parent":0,"link":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","date":"2014-05-28T00:55:04+00:00","modified":"2014-05-28T00:55:04+00:00","format":"standard","slug":"1-revision-v1","guid":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","excerpt":"This is the excerpt","menu_order":0,"comment_status":"closed","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-28T00:55:04+00:00","modified_tz":"UTC","modified_gmt":"2014-05-28T00:55:04+00:00","password":"","title_raw":"test","content_raw":"sdfsdfsf sdfsfdsf","excerpt_raw":"","guid_raw":"http:\/\/example.com\/2014\/05\/1-revision-v1\/","post_meta":[],"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/1/revisions/2","author":"http:\/\/example.com\/wp-json\/users\/1","collection":"http:\/\/example.com\/wp-json\/posts/1/revisions","up":"http:\/\/example.com\/wp-json\/posts\/1"}},"terms":[]};

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/1/revisions/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('title')).toEqual('test');
          expect(this.model.get('author').get('username')).toEqual('admin');
          expect(this.model.get('author').get('name')).toEqual('admin');
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/posts/1/revisions/1',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new Revision({ID: 1, post: 1});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });
  });
});