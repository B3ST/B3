define([
  'models/taxonomy-model',
  'models/settings-model',
  'sinon'
], function (Taxonomy, Settings) {
  describe("Taxonomy", function() {
    beforeEach(function() {
      this.model = new Taxonomy();
    });

    describe("When initializing Taxonomy", function() {
      it("should have an empty name", function() {
        expect(this.model.get('name')).toEqual('');
      });

      it("should have a null slug", function() {
        expect(this.model.get('slug')).toBeNull();
      });

      using('model fields', ['labels', 'types', 'meta'], function (field) {
        it("should have an empty " + field + " object", function() {
          expect(this.model.get(field)).toEqual({});
        });
      });

      using('model fields', ['show_cloud', 'hierarchical'], function (field) {
        it("should have a falsy " + field, function() {
          expect(this.model.get(field)).toBeFalsy();
        });
      });
    });

    describe("When fetching a Taxonomy", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.model  = new Taxonomy({slug: 'category'});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"name":"Categories","slug":"category","labels":{"name":"Categories","singular_name":"Category","search_items":"Search Categories","popular_items":null,"all_items":"All Categories","parent_item":"Parent Category","parent_item_colon":"Parent Category:","edit_item":"Edit Category","view_item":"View Category","update_item":"Update Category","add_new_item":"Add New Category","new_item_name":"New Category Name","separate_items_with_commas":null,"add_or_remove_items":null,"choose_from_most_used":null,"not_found":null,"menu_name":"Categories","name_admin_bar":"category"},"types":{"post":{"name":"Posts","slug":"post","description":"","labels":{"name":"Posts","singular_name":"Post","add_new":"Add New","add_new_item":"Add New Post","edit_item":"Edit Post","new_item":"New Post","view_item":"View Post","search_items":"Search Posts","not_found":"No posts found.","not_found_in_trash":"No posts found in Trash.","parent_item_colon":null,"all_items":"All Posts","menu_name":"Posts","name_admin_bar":"Post"},"queryable":true,"searchable":true,"hierarchical":false,"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/types\/post","collection":"http:\/\/example.com\/wp-json\/posts\/types","http:\/\/wp-api.org\/1.1\/collections\/taxonomy\/":"http:\/\/example.com\/wp-json\/taxonomies?type=post","archives":"http:\/\/example.com\/wp-json\/posts"}}}},"show_cloud":true,"hierarchical":true,"meta":{"links":{"archives":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms","collection":"http:\/\/example.com\/wp-json\/taxonomies","self":"http:\/\/example.com\/wp-json\/taxonomies\/category"}}};

          this.server.respondWith(
            'GET',
            Settings.get('apiUrl') + '/taxonomies/category',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('name')).toEqual('Categories');
          expect(this.model.get('labels')).toEqual({"name":"Categories","singular_name":"Category","search_items":"Search Categories","popular_items":null,"all_items":"All Categories","parent_item":"Parent Category","parent_item_colon":"Parent Category:","edit_item":"Edit Category","view_item":"View Category","update_item":"Update Category","add_new_item":"Add New Category","new_item_name":"New Category Name","separate_items_with_commas":null,"add_or_remove_items":null,"choose_from_most_used":null,"not_found":null,"menu_name":"Categories","name_admin_bar":"category"});
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('apiUrl') + '/taxonomies/category',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new Taxonomy({slug: 'category'});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });

    describe("When fetching terms", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.model  = new Taxonomy({"name":"Categories","slug":"category","labels":{"name":"Categories","singular_name":"Category","search_items":"Search Categories","popular_items":null,"all_items":"All Categories","parent_item":"Parent Category","parent_item_colon":"Parent Category:","edit_item":"Edit Category","view_item":"View Category","update_item":"Update Category","add_new_item":"Add New Category","new_item_name":"New Category Name","separate_items_with_commas":null,"add_or_remove_items":null,"choose_from_most_used":null,"not_found":null,"menu_name":"Categories","name_admin_bar":"category"},"types":{"post":{"name":"Posts","slug":"post","description":"","labels":{"name":"Posts","singular_name":"Post","add_new":"Add New","add_new_item":"Add New Post","edit_item":"Edit Post","new_item":"New Post","view_item":"View Post","search_items":"Search Posts","not_found":"No posts found.","not_found_in_trash":"No posts found in Trash.","parent_item_colon":null,"all_items":"All Posts","menu_name":"Posts","name_admin_bar":"Post"},"queryable":true,"searchable":true,"hierarchical":false,"meta":{"links":{"self":"http:\/\/example.com\/wp-json\/posts\/types\/post","collection":"http:\/\/example.com\/wp-json\/posts\/types","http:\/\/wp-api.org\/1.1\/collections\/taxonomy\/":"http:\/\/example.com\/wp-json\/taxonomies?type=post","archives":"http:\/\/example.com\/wp-json\/posts"}}}},"show_cloud":true,"hierarchical":true,"meta":{"links":{"archives":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms","collection":"http:\/\/example.com\/wp-json\/taxonomies","self":"http:\/\/example.com\/wp-json\/taxonomies\/category"}}});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching term collection is successful", function() {
        it("should return the term collection", function() {
          var response = [
            {"ID":2,"name":"News", "taxonomy":"category", "slug":"news","description":"This is the news category.","parent":null,"count":8,"link":"http:\/\/example.com\/category\/news\/","meta":{"links":{"collection":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms\/1"}}}
          ];

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/taxonomies/category/terms',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetchTerms({
            done: function (data) { expect(data.models[0].attributes).toEqual(response[0]); }
          });
          this.server.respond();
        });
      });

      describe("When fetching a single term is successful", function() {
        it("should return the term", function() {
          var response = {"ID":2,"name":"News","slug":"news","description":"This is the news category.","parent":null,"count":8,"link":"http:\/\/example.com\/category\/news\/","meta":{"links":{"collection":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms\/1"}}};

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/taxonomies/category/terms/2',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetchTerms({
            done: function (data) { expect(data).toEqual(response); }
          }, 2);
          this.server.respond();
        });
      });

      describe("When fetching fails", function() {
        it("should flag an error", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            'http://example.com/wp-json/taxonomies/category/terms',
            [404, {'Content-Type': 'application/json'}, JSON.stringify('')]
          );

          this.model.fetchTerms({
            done: function (data) { expect(true).toBeFalsy(); },
            fail: function (data) { expect(data).not.toEqual({}); }
          });
        });
      });

      describe("When Taxonomy is not defined", function() {
        it("should return false", function() {
          this.model = new Taxonomy({slug: 'category'});
          expect(this.model.fetchTerms()).toBeFalsy();
        });
      });
    });
  });
});
