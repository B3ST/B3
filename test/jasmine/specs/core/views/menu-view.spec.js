define([
  'views/menu-view',
  'models/menu-item-model',
  'collections/menu-item-collection'
], function (MenuView, MenuItem, MenuItems) {
  describe("MenuView", function() {
    beforeEach(function() {
      var items = [{"ID":1266,"parent":0,"order":1,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1266","object":1149,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/about","title":"About","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/about"}}},{"ID":1265,"parent":0,"order":2,"type":"nav_menu_item","guid":"http:\/\/localhost:8888\/wordpress\/?p=1265","object":18,"object_parent":0,"object_type":"page","link":"http:\/\/localhost:8888\/wordpress\/a-page","title":"A Page","attr_title":"","description":"","classes":[""],"target":"","xfn":"","meta":{"links":{"object":"http:\/\/localhost:8888\/wordpress\/wp-json\/pages\/a-page"}}}];
      this.view = new MenuView({collection: new MenuItems(items), menuId: 'menu-primary'});
    });

    describe(".render", function() {
      it("should define the wrapping el with the given id", function() {
        this.view.render();
        expect(this.view.$el.attr('id')).toEqual('menu-primary');
      });

      it("should display the given items", function() {
        this.view.render();
        expect(this.view.$el.children().length).toEqual(2);
      });

      describe("When menus have submenus", function() {
        it("should submenus should be nested", function() {
          var menuItems = new MenuItems([
            new MenuItem({ID: 1, parent: 0, title: 'Menu 1'}),
            new MenuItem({ID: 2, parent: 0, title: 'Menu 2'}),
            new MenuItem({ID: 3, parent: 1, title: 'Menu 3'}),
            new MenuItem({ID: 4, parent: 1, title: 'Menu 4'}),
            new MenuItem({ID: 5, parent: 2, title: 'Menu 5'}),
            new MenuItem({ID: 6, parent: 3, title: 'Menu 6'}),
            new MenuItem({ID: 7, parent: 3, title: 'Menu 7'}),
            new MenuItem({ID: 8, parent: 5, title: 'Menu 8'})
          ]);

          this.view = new MenuView({collection: menuItems});
          this.view.render();

          expect(this.view.$el.children().length).toEqual(2);

          expect(this.view.$('#menu-item-1 > ul.dropdown-menu').children().length).toEqual(2);
          expect(this.view.$('#menu-item-2 > ul.dropdown-menu').children().length).toEqual(1);

          expect(this.view.$('#menu-item-3 > ul.dropdown-menu').children().length).toEqual(2);
          expect(this.view.$('#menu-item-5 > ul.dropdown-menu').children().length).toEqual(1);
        });
      });
    });
  });
});