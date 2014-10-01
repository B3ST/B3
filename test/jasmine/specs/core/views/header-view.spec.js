/* global define */

define([
  'views/header-view',
  'buses/event-bus',
  'buses/navigator'
], function (HeaderView, EventBus, Navigator) {
  describe("HeaderView", function() {
    var view;

    describe("When clicking in home", function() {
      beforeEach(function() {
        view = new HeaderView();
        view.render();
      });

      it("should trigger a navigation to index event", function() {
        var trigger = spyOn(EventBus, 'trigger');
        view.$('.navbar-brand').click();
        expect(trigger).toHaveBeenCalledWith('menu-item:select', {id: -1});
      });

      it("should navigateo to home", function() {
        var navigate = spyOn(Navigator, 'navigateToHome');
        view.$('.navbar-brand').click();
        expect(navigate).toHaveBeenCalledWith('', null, true);
      });
    });
  });
});
