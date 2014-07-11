define([
  'models/page-model',
  'models/settings-model',
  'sinon'
], function (Page, Settings) {
  describe("Page", function() {
    beforeEach(function() {
      this.model = new Page();
    });

    describe("When initializing a Page", function() {
      it("should have a null ID", function() {
        expect(this.model.get('ID')).toBeNull();
      });

      it("should have a draft status", function() {
        expect(this.model.get('status')).toEqual('draft');
      });

      it("should have a page type", function() {
        expect(this.model.get('type')).toEqual('page');
      });

      it("should have a standard format", function() {
        expect(this.model.get('format')).toEqual('standard');
      });

      it("should have no parent", function() {
        expect(this.model.get('parent')).toEqual(0);
      });

      it("should have menu_order set to 0", function() {
        expect(this.model.get('menu_order')).toEqual(0);
      });

      it("should have a closed comment_status", function() {
        expect(this.model.get('comment_status')).toEqual('closed');
      });

      it("should have an open ping_status", function() {
        expect(this.model.get('ping_status')).toEqual('open');
      });

      it("should not be sticky", function() {
        expect(this.model.get('sticky')).toBeFalsy();
      });

      it("should have empty terms", function() {
        expect(this.model.get('terms')).toEqual([]);
      });

      it("should have author defined", function() {
        expect(this.model.get('author') instanceof Backbone.Model).toBeTruthy();
      });

      it("should have empty meta", function() {
        expect(this.model.get('meta')).toEqual({});
      });

      using('model fields', ['date', 'date_gmt', 'modified', 'modified_gmt'], function (field) {
        it("should have " + field + " defined", function() {
          expect(this.model.get(field) instanceof Date).toBeTruthy();
        });
      });

      using('model fields', ['date_tz', 'modified_tz'], function (field) {
        it("should have " + field + " set to Etc/UTC", function() {
          expect(this.model.get(field)).toEqual('Etc/UTC');
        });
      });

      using('model fields', ['title', 'content', 'link', 'slug', 'guid', 'excerpt'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });
    });

    describe("When fetching a Page", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.model  = new Page({ID: 1});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"ID":1,"title":"test","status":"publish","type":"page","author":{"ID":1,"username":"admin","name":"admin","first_name":"taylor","last_name":"lovett","nickname":"admin","slug":"admin","URL":"","avatar":"http://1.gravatar.com/avatar/77778145a1b7a2cad0b279b432979292?s=96","description":"","email":"admin@taylorlovett.com","registered":"2013-04-04T16:58:14+00:00","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"content":"Test content","parent":0,"link":"http://example.com/test/","date":"2014-05-03T15:09:39+00:00","modified":"2014-05-03T15:09:39+00:00","format":"standard","slug":"test","guid":"http://example.com/?page_id=3186","excerpt":"Test content","menu_order":0,"comment_status":"closed","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-03T15:09:39+00:00","modified_tz":"UTC","modified_gmt":"2014-05-03T15:09:39+00:00","meta":{"links":{"self":"http://example.com/wp-json/pages/test","author":"http://example.com/wp-json/users/1","collection":"http://example.com/wp-json/pages","replies":"http://example.com/wp-json/pages/3186/comments","version-history":"http://example.com/wp-json/pages/3186/revisions"}},"featured_image":null,"terms":[]};

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/pages/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('title')).toEqual('test');
          expect(this.model.get('status')).toEqual('publish');
          expect(this.model.get('content')).toEqual('Test content');
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/pages/1',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new Page({ID: 1});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });
  });
});