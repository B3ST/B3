/* global define, describe, beforeEach, expect, it, using, spyOn */

define([
  'views/menu-item-view',
  'models/menu-item-model',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator'
], function (MenuItemView, MenuItem, Settings, EventBus, Navigator) {
  'use strict';

  describe("MenuItemView", function() {
    var item, view;
    beforeEach(function() {
      item = new MenuItem({
        ID: 1257,
        parent: 0,
        order: 1,
        type: "nav_menu_item",
        guid: "http://localhost:8888/wordpress/post/1257",
        object: 1149,
        object_parent: 0,
        object_type: 'page',
        link: "http://wordpress.example.org/about",
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
        var bus = spyOn(EventBus, 'on');
        view = new MenuItemView({model: item});

        expect(bus).toHaveBeenCalledWith('menu-item:view:select', view.itemSelected, view);
      });
    });

    describe(".itemSelected", function() {
      beforeEach(function() {
        view = new MenuItemView({model: item});
        view.render();
        view.$el.addClass('active');
      });

      it("should deactivate its menu if the sent id is not the same", function() {
        view.itemSelected({id: 1});
        expect(view.$el.attr('class')).not.toEqual('active');
      });

      describe("When the sent parent id is the same as the model id", function() {
        it("should activate its menu", function() {
          view.itemSelected({ id: 1130, parent: 1257 });
          expect(view.$el.attr('class')).toEqual('active');
        });

        it("should trigger the same event setting its own parent", function() {
          var trigger = spyOn(EventBus, 'trigger');
          view.itemSelected({ id: 1130, parent: 1257 });
          expect(trigger).toHaveBeenCalledWith('menu-item:view:select', {id: 1130, parent: 0});
        });
      });
    });

    describe(".toggleDropdown", function() {
      it("should turn the menu into a dropdown menu", function() {
        view = new MenuItemView({ model: item });
        view.render();
        view.toggleDropdown();

        expect(view.$el.attr('class')).toEqual('dropdown');
        expect(view.$('.menu-item').attr('class')).toContain('dropdown-toggle');
        expect(view.$('.menu-item').attr('data-toggle')).toEqual('dropdown');
        expect(view.$('.menu-item').html()).toContain('<span class="caret"></span>');
        expect(view.$('ul').attr('class')).toEqual('dropdown-menu');
        expect(view.$('ul').attr('role')).toEqual('menu');
      });
    });

    using('menu types', ['page', 'post', 'category', 'tag'], function (type) {
      describe("Clicking an item", function() {
        var trigger, navigate;

        beforeEach(function() {
          type = type + '/';
          type = type.replace('page/', '');

          item.set({
            'object_type': type,
            'link': 'http://wordpress.example.org/' + type + 'about'
          });
          trigger = spyOn(EventBus, 'trigger');
          navigate = spyOn(Navigator, 'navigate');
          view = new MenuItemView({model: item});

          view.render();
        });

        it("should trigger menu selection events", function() {
          view.$('.menu-item').click();
          expect(trigger).toHaveBeenCalledWith('menu-item:view:select', {id: 1257, parent: 0});
        });

        it("should trigger navigate event to the given link", function() {
          view.$('.menu-item').click();
          expect(trigger).toHaveBeenCalledWith('menu-item:view:navigate', { link: Settings.get('site_url') + type + 'about' });
        });

        it("should activate the menu item", function() {
          view.$('.menu-item').click();
          expect(view.$el.attr('class')).toContain('active');
        });

        describe("when the link is for an external resource", function () {
          beforeEach(function() {
            item.set({'link': 'http://log.pt/'});
            view = new MenuItemView({model: item});
            view.render();
          });

          it("should not trigger menu selection events", function() {
            view.$('.menu-item').click();
            type = type.replace('page', '');
            expect(trigger).not.toHaveBeenCalledWith('router:nav', {route: type + "/about", options: {trigger: true}});
          });
        });

        describe("when the menu is a dropdown", function() {
          beforeEach(function() {
            view.toggleDropdown();
          });

          it("should not trigger any events", function() {
            view.$('.menu-item').click();
            expect(trigger).not.toHaveBeenCalled();
          });

          it("should not activate the menu item", function() {
            view.$('.menu-item').click();
            expect(view.$el.attr('class')).not.toContain('active');
          });
        });
      });
    });
  });
});
