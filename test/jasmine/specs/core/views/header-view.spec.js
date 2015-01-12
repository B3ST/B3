/* global define */

define([
  'views/header-view',
  'buses/navigator'
], function (HeaderView, Navigator) {
  describe("HeaderView", function() {
    var view;

    describe("When clicking in home", function() {
      beforeEach(function() {
        view = new HeaderView();
        view.render();
      });

      it("should trigger a navigation to index event", function() {
        var trigger = spyOn(Navigator, 'navigateToHome');
        view.$('.navbar-brand').click();
        expect(trigger).toHaveBeenCalledWith('', 0, true);
      });
    });
  });
});
