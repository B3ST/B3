define([
  'views/header-view',
  'models/settings-model',
  'models/menu-model',
  'collections/menu-item-collection',
  'controllers/event-bus'
], function (HeaderView, Settings, Menu, MenuItems, EventBus) {
  describe("HeaderView", function() {
    beforeEach(function() {
      var response = {"location":"primary","name":"Primary Menu","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus\/primary","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/b3:menus"}},"menu":{"ID":61,"name":"Empty Menu","slug":"empty-menu","description":"","count":2,"items":[{"ID":1266,"parent":0,"order":1,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1266","object":1149,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/about","title":"About","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/about"}}},{"ID":1265,"parent":0,"order":2,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1265","object":18,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/a-page","title":"A Page","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/a-page"}}}]}};
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
        'GET',
        'http://localhost:8888/wordpress/wp-json/b3:menus/primary',
        [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
      );
      this.menus = {
        primary: {
          location: "primary",
          name: "Primary Menu",
          meta: {
            links: {
              self: "http://localhost:8888/wordpress/wp-json/b3:menus/primary",
              collection: "http://localhost:8888/wordpress/wp-json/b3:menus"
            }
          }
        }
      };

      this.view = new HeaderView({ collection: new MenuItems(), menus: this.menus });
      this.server.respond();
    });

    describe(".initialize", function() {
      it("should fetch the primary menu", function() {
        this.spy = spyOn(Menu.prototype, 'fetch');
        this.view = new HeaderView({ collection: new MenuItems(), menus: this.menus });
        expect(this.spy).toHaveBeenCalled();
      });
    });

    describe(".render", function() {
      beforeEach(function() {
        this.view.render();
      });

      it("should render the home container", function() {
        expect(this.view.$('#b3-home')).toBeDefined();
      });

      it("should render the menu and display its items", function() {
        expect(this.view.$('#menu-primary').children().length).toEqual(2);
      });
    });

    describe("When clicking in home", function() {
      beforeEach(function() {
        this.spy = spyOn(EventBus, 'trigger');
        this.view.render();
      });

      it("should trigger a navigation to index event", function() {
        this.view.$('#b3-home').click();
        expect(this.spy).toHaveBeenCalledWith('router:nav', { route: '', options: { trigger: true }});
        expect(this.spy).toHaveBeenCalledWith('menu:item-selected', {id: -1});
      });
    });
  });
});