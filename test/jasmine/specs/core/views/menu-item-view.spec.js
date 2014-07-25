define([
  'views/menu-item-view',
  'models/menu-item-model',
  'controllers/event-bus'
], function (MenuItemView, MenuItem, EventBus) {
  describe("MenuItemView", function() {
    beforeEach(function() {
      this.item = new MenuItem({
        ID: 1257,
        parent: 0,
        order: 1,
        type: "nav_menu_item",
        guid: "http://localhost:8888/wordpress/post/1257",
        object: 1149,
        object_parent: 0,
        object_type: 'page',
        link: "http://localhost:8888/wordpress/about",
        title: "About",
        attr_title: "",
        description: "",
        classes: [
          ""
        ],
        target: "",
        xfn: "",
        meta: {
          links: {
            object: "http://localhost:8888/wordpress/wp-json/pages/about"
          }
        }
      });
    });

    describe(".initialize", function() {
      it("should bind to a given set of events", function() {
        this.spy  = spyOn(EventBus, 'bind');
        this.view = new MenuItemView({model: this.item});

        expect(this.spy).toHaveBeenCalledWith('menu:item-selected', this.view.itemSelected);
      });
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view = new MenuItemView({model: this.item});
        this.view.render();
        expect(this.view.$el.children().length).toEqual(1);
        expect(this.view.$el.attr('id')).toEqual('menu-item-1257');
        expect(this.view.$('.b3-menu-item').text()).toEqual('About');
        expect(this.view.$('.b3-menu-item').attr('href')).toEqual('http://localhost:8888/wordpress/about');
      });
    });

    describe(".itemSelected", function() {
      beforeEach(function() {
        this.view = new MenuItemView({model: this.item});
        this.view.render();
        this.view.$el.addClass('active');
      });

      it("should deactivate its menu if the sent id is not the same", function() {
        this.view.itemSelected({id: 1});
        expect(this.view.$el.attr('class')).not.toEqual('active');
      });

      describe("When the sent parent id is the same as the model id", function() {
        it("should activate its menu", function() {
          this.view.itemSelected({id: 1130, parent: 1257});
          expect(this.view.$el.attr('class')).toEqual('active');
        });

        it("should trigger the same event setting its own parent", function() {
          this.spy = spyOn(EventBus, 'trigger');
          this.view.itemSelected({id: 1130, parent: 1257});
          expect(this.spy).toHaveBeenCalledWith('menu:item-selected', {id: 1130, parent: 0});
        });
      });
    });

    describe(".toggleDropdown", function() {
      it("should turn the menu into a dropdown menu", function() {
        this.view = new MenuItemView({model: this.item});
        this.view.render();
        this.view.toggleDropdown();

        expect(this.view.$el.attr('class')).toEqual('dropdown');
        expect(this.view.$('.b3-menu-item').attr('class')).toContain('dropdown-toggle');
        expect(this.view.$('.b3-menu-item').attr('href')).toEqual('#');
        expect(this.view.$('.b3-menu-item').attr('data-toggle')).toEqual('dropdown');
        expect(this.view.$('.b3-menu-item').html()).toEqual('About <span class="caret"></span>');
        expect(this.view.$('ul').attr('class')).toEqual('dropdown-menu');
        expect(this.view.$('ul').attr('role')).toEqual('menu');
      });
    });

    using('menu types', ['page', 'post', 'category', 'tag'], function (type) {
      describe("When clicking in an item", function() {
        beforeEach(function() {
          this.item.set({'object_type': type});
          this.spy  = spyOn(EventBus, 'trigger');
          this.view = new MenuItemView({model: this.item});

          this.view.render();
        });

        it("should trigger events that a menu was selected", function() {
          this.view.$('.b3-menu-item').click();
          type = type.replace('page', '');
          expect(this.spy).toHaveBeenCalledWith('router:nav', {route: type + "/about", options: {trigger: true}});
          expect(this.spy).toHaveBeenCalledWith('menu:item-selected', {id: 1257, parent: 0});
        });

        it("should activate the menu item", function() {
          this.view.$('.b3-menu-item').click();
          expect(this.view.$el.attr('class')).toContain('active');
        });

        describe("When menu is a dropdown", function() {
          beforeEach(function() {
            this.view.toggleDropdown();
          });

          it("should not trigger any event", function() {
            this.view.$('.b3-menu-item').click();
            expect(this.spy).not.toHaveBeenCalled();
          });

          it("should not activate the menu item", function() {
            this.view.$('.b3-menu-item').click();
            expect(this.view.$el.attr('class')).not.toContain('active');
          });
        });
      });
    });
  });
});