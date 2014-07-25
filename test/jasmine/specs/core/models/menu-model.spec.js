define([
  'models/menu-model',
  'models/menu-item-model',
  'sinon'
], function (Menu, MenuItem) {
  describe("Menu", function() {
    describe(".initialize", function() {
      beforeEach(function() {
        this.menu = new Menu();
      });

      using('model fields', ['location', 'name'], function(field) {
        it("should have an empty " + field, function() {
          expect(this.menu.get(field)).toEqual('');
        });
      });

      using('model fields', ['menu', 'meta'], function(field) {
        it("should have an empty object " + field, function() {
          expect(this.menu.get(field)).toEqual({});
        });
      });
    });

    describe("When fetching the menu", function() {
      beforeEach(function() {
        this.model = {"location":"primary","name":"Primary Menu","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus\/primary","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus"}}};
        this.menu  = new Menu(this.model);
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {"location":"primary","name":"Primary Menu","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus\/primary","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus"}},"menu":{"ID":61,"name":"Empty Menu","slug":"empty-menu","description":"","count":2,"items":[{"ID":1266,"parent":0,"order":1,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1266","object":1149,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/about","title":"About","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/about"}}},{"ID":1265,"parent":0,"order":2,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1265","object":18,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/a-page","title":"A Page","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/a-page"}}}]}};
          var server = sinon.fakeServer.create();
          server.respondWith(
            'GET',
            this.model.meta.links.self,
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.menu.fetch();
          server.respond();

          expect(this.menu.get('menu')).not.toEqual({});
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';
          var server   = sinon.fakeServer.create();
          server.respondWith(
            'GET',
            this.model.meta.links.self,
            [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
          );

          this.menu.fetch();
          server.respond();

          expect(this.menu.get('menu')).toEqual({});
        });
      });
    });

    describe(".getItems", function() {
      it("should return all items in the menu", function() {
        this.model = {"location":"primary","name":"Primary Menu","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus\/primary","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus"}},"menu":{"ID":61,"name":"Empty Menu","slug":"empty-menu","description":"","count":2,"items":[{"ID":1266,"parent":0,"order":1,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1266","object":1149,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/about","title":"About","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/about"}}},{"ID":1265,"parent":0,"order":2,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1265","object":18,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/a-page","title":"A Page","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/a-page"}}}]}};
        this.menu  = new Menu(this.model);

        var items = this.menu.getItems();

        expect(items.models.length).toEqual(2);
        expect(items.models[0] instanceof MenuItem).toBeTruthy();
        expect(items.models[0].get('title')).toEqual(this.model.menu.items[0].title);
      });
    });
  });
});