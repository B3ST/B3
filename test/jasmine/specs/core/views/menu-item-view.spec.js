/* global define, describe, beforeEach, expect, it, using, spyOn */

define([
  'views/menu-item-view',
  'models/menu-item-model',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator'
], function (MenuItemView, MenuItem, Settings, EventBus, Navigator) {
  'use strict';

  describe('MenuItemView', function() {
    var item, view;
    beforeEach(function() {
      var json = getJSONFixture('menu_item.json');
      item = new MenuItem(json);
    });

    using('menu types', ['page', 'post', 'category', 'tag'], function (type) {
      describe('Clicking an item', function() {
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

        it('should trigger menu selection events', function() {
          view.$('.menu-item').click();
          expect(trigger).toHaveBeenCalledWith('change:menu:item:state', { id: 1257, parent: 0 });
        });

        it('should activate the menu item', function() {
          view.$('.menu-item').click();
          expect(view.$el.attr('class')).toContain('active');
        });

        describe('when the link is for an external resource', function () {
          beforeEach(function() {
            item.set({'link': 'http://log.pt/'});
            view = new MenuItemView({model: item});
            view.render();
          });

          it('should not trigger menu selection events', function() {
            view.$('.menu-item').click();
            type = type.replace('page', '');
            expect(trigger).not.toHaveBeenCalledWith('router:nav', {route: type + '/about', options: {trigger: true}});
          });
        });
      });
    });
  });
});
