/* global define */

define([
  'views/header-view',
  'buses/event-bus'
], function (HeaderView, EventBus) {
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
        expect(trigger).toHaveBeenCalledWith('header:view:index', { id: -1 });
      });
    });
  });
});
