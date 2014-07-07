define([
  'models/media-model',
  'sinon'
], function (Media) {
  describe("Media", function() {
    beforeEach(function() {
      this.model = new Media();
    });

    describe("When initializing Media", function() {
      it("should have a null ID", function() {
        expect(this.model.get('ID')).toBeNull();
      });

      it("should have status set to inherit", function() {
        expect(this.model.get('status')).toEqual('inherit');
      });

      it("should have an attachment type", function() {
        expect(this.model.get('type')).toEqual('attachment');
      });

      it("should have 0 as menu_order", function() {
        expect(this.model.get('menu_order')).toEqual(0);
      });

      it("should have a standard format", function() {
        expect(this.model.get('format')).toEqual('standard');
      });

      it("should not be a sticky", function() {
        expect(this.model.get('sticky')).toBeFalsy();
      });

      it("should be an image", function() {
        expect(this.model.get('is_image')).toBeTruthy();
      });

      it("should have no terms", function() {
        expect(this.model.get('terms')).toEqual([]);
      });

      using('model fields', ['date_tz', 'modified_tz'], function (field) {
        it('should have ' + field + ' set to Etc/UTC', function() {
          expect(this.model.get(field)).toEqual('Etc/UTC');
        });
      });

      using('model fields', ['comment_status', 'ping_status'], function (field) {
        it("should have an open " + field, function() {
          expect(this.model.get(field)).toEqual('open');
        });
      });

      using('model fields', ['image_meta', 'meta', 'author'], function (field) {
        it("should have an empty " + field + " object", function() {
          expect(this.model.get(field)).toEqual({});
        });
      });

      using('model fields', ['title', 'content', 'link', 'date', 'date_gmt', 'modified', 'modified_gmt', 'slug', 'guid', 'excerpt', 'source'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });
    });
  });

  describe(".getAuthor", function() {
    it("should return a User model of the author", function() {
      var model  = new Media({author: {"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"wordpress","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14+00:00","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}}});
      var author = model.getAuthor();

      expect(author.get('ID')).toEqual(1);
      expect(author.get('username')).toEqual('admin');
      expect(author.get('name')).toEqual('admin');
    });
  });

  describe("When fetching Media", function() {
    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.model  = new Media({ID: 1});
    });

    afterEach(function() {
      this.server.restore();
    });

    describe("When fetching is successful", function() {
      it("should set its attributes", function() {
        var response = {"ID":1,"title":"143Construction-600&#215;400","status":"inherit","type":"attachment","author":{"ID":1,"username":"admin","name":"admin","first_name":"word","last_name":"press","nickname":"wordpress","slug":"admin","URL":"","avatar":"","description":"","registered":"2013-04-04T16:58:14+00:00","meta":{"links":{"self":"http://example.com/wp-json/users/1","archives":"http://example.com/wp-json/users/1/posts"}}},"content":"","parent":0,"link":"http://example.com/?attachment_id=2652","date":"2014-04-13T17:10:42+00:00","modified":"2014-04-13T17:10:42+00:00","format":"standard","slug":"143construction-600x400","guid":"http://example.com/wp-content/uploads/2014/04/143Construction-600x400.jpg","excerpt":null,"menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-04-13T17:10:42+00:00","modified_tz":"UTC","modified_gmt":"2014-04-13T17:10:42+00:00","meta":{"links":{"self":"http://example.com/wp-json/media/2652","author":"http://example.com/wp-json/users/1","collection":"http://example.com/wp-json/media","replies":"http://example.com/wp-json/media/2652/comments","version-history":"http://example.com/wp-json/media/2652/revisions"}},"terms":[],"source":"http://example.com/wp-content/uploads/2014/04/143Construction-600x400.jpg","is_image":true,"attachment_meta":{"width":600,"height":400,"file":"2014/04/143Construction-600x400.jpg","sizes":{"thumbnail":{"file":"143Construction-600x400-150x150.jpg","width":150,"height":150,"mime-type":"image/jpeg","url":"http://example.com/wp-content/uploads/2014/04/143Construction-600x400-150x150.jpg"},"medium":{"file":"143Construction-600x400-300x200.jpg","width":300,"height":200,"mime-type":"image/jpeg","url":"http://example.com/wp-content/uploads/2014/04/143Construction-600x400-300x200.jpg"},"post-thumbnail":{"file":"143Construction-600x400-600x270.jpg","width":600,"height":270,"mime-type":"image/jpeg","url":"http://example.com/wp-content/uploads/2014/04/143Construction-600x400-600x270.jpg"}},"image_meta":{"aperture":8,"credit":"","camera":"NIKON D5000","caption":"","created_timestamp":1322435644,"copyright":"","focal_length":"18","iso":"200","shutter_speed":"0.004","title":""}}};

        this.server.respondWith(
          'GET',
          '/media/1',
          [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
        );

        this.model.fetch();
        this.server.respond();

        expect(this.model.get('title')).toEqual('143Construction-600&#215;400');
        expect(this.model.get('status')).toEqual('inherit');
      });
    });

    describe("When fethcing fails", function() {
      it("should maintain its attributes", function() {
        var response = '';

        this.server.respondWith(
          'GET',
          '/media/1',
          [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
        );

        this.model.fetch();
        this.server.respond();

        var empty = new Media({ID: 1});
        expect(this.model.attributes).toEqual(empty.attributes);
      });
    });
  });
});
