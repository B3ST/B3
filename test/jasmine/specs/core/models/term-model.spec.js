define([
  'models/term-model',
  'models/settings-model',
  'sinon'
], function (Term, Settings) {
  describe("Term", function() {
    beforeEach(function() {
      this.model = new Term();
    });

    describe("When initializing a Term", function() {
      using('model fields', ['ID', 'parent'], function (field) {
        it("should have a null " + field, function() {
          expect(this.model.get(field)).toBeNull();
        });
      });

      using('model fields', ['name', 'slug', 'description', 'link'], function (field) {
        it("should have empty " + field, function() {
          expect(this.model.get(field)).toEqual('');
        });
      });

      it("should have category as a default taxonomy", function() {
        expect(this.model.get('taxonomy')).toEqual('category');
      });

      it("should have default count as 0", function() {
        expect(this.model.get('count')).toEqual(0);
      });

      it("should have an empty meta", function() {
        expect(this.model.get('meta')).toEqual({});
      });
    });

    describe("When fetching a term", function() {
      beforeEach(function() {
        this.model  = new Term({ID: 1, taxonomy: 'category'});
        this.server = sinon.fakeServer.create();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"ID":2,"name":"News","slug":"news","description":"This is the news category.","parent":null,"count":8,"link":"http:\/\/example.com\/category\/news\/","meta":{"links":{"collection":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/example.com\/wp-json\/taxonomies\/category\/terms\/1"}}};

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/taxonomies/category/terms/1',
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('name')).toEqual('News');
          expect(this.model.get('count')).toEqual(8);
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';

          this.server.respondWith(
            'GET',
            Settings.get('url') + '/taxonomies/category/terms/1',
            [404, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new Term({ID: 1, taxonomy: 'category'});
          expect(this.model.attributes).toEqual(empty.attributes);
        });
      });
    });
  });
});