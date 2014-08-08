define([
  'models/post-type-model',
  'models/settings-model',
  'sinon'
], function (PostType, Settings) {
  describe("PostType", function() {
    beforeEach(function() {
      this.model = new PostType();
    });

    describe("When initializing PostType", function() {
      it("should have an empty name", function() {
        expect(this.model.get('name')).toEqual('');
      });

      it("should have a null slug", function() {
        expect(this.model.get('slug')).toBeNull();
      });

      it("should have an empty taxonomy array", function() {
        expect(this.model.get('taxonomies')).toEqual([]);
      });

      using('model fields', ['labels', 'meta'], function (field) {
        it("should have an empty " + field + " object", function() {
          expect(this.model.get(field)).toEqual({});
        });
      });

      using('model fields', ['queryable', 'searchable', 'hierarchical'], function (field) {
        it("should have falsy " + field, function() {
          expect(this.model.get(field)).toBeFalsy();
        });
      });
    });

    describe("When fetching PostType", function() {
      beforeEach(function() {
        this.model  = new PostType({slug: 'page'});
        this.server = sinon.fakeServer.create();
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set to the given values", function() {
          var response = {"name":"Pages","slug":"page","description":"","labels":{"name":"Pages","singular_name":"Page","add_new":"Add New","add_new_item":"Add New Page","edit_item":"Edit Page","new_item":"New Page","view_item":"View Page","search_items":"Search Pages","not_found":"No pages found.","not_found_in_trash":"No pages found in Trash.","parent_item_colon":"Parent Page:","all_items":"All Pages","menu_name":"Pages","name_admin_bar":"Page"},"queryable":false,"searchable":true,"hierarchical":true,"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/types\/page","collection":"http:\/\/example.com\/wp-json\/posts\/types","http:\/\/wp-api.org\/1.1\/collections\/taxonomy\/":"http:\/\/example.com\/wp-json\/taxonomies?type=page","archives":"http:\/\/example.com\/wp-json\/pages"}},"taxonomies":[]};

          this.server.respondWith(
            'GET',
            Settings.get('api_url') + '/posts/types/page',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('name')).toEqual('Pages');
          expect(this.model.get('labels')).toEqual({"name":"Pages","singular_name":"Page","add_new":"Add New","add_new_item":"Add New Page","edit_item":"Edit Page","new_item":"New Page","view_item":"View Page","search_items":"Search Pages","not_found":"No pages found.","not_found_in_trash":"No pages found in Trash.","parent_item_colon":"Parent Page:","all_items":"All Pages","menu_name":"Pages","name_admin_bar":"Page"});
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('api_url') + '/posts/types/page',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new PostType({slug: 'page'});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });
  });
});
