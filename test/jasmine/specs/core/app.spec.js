define([
  'app',
  'controllers/event-bus',
  'views/header-view',
  'views/footer-view'
], function (App, EventBus, HeaderView, FooterView) {
  describe("App", function() {
    beforeEach(function() {
      this.app = App;
      this.app.start();
    });

    it("should have an header region defined", function() {
      expect(this.app.header).toBeDefined();
      expect(this.app.header.currentView.el.isEqualNode(new HeaderView().render().el)).toBeTruthy();
    });

    it("should have a main region defined", function() {
      expect(this.app.main).toBeDefined();
    });

    it("should have a footer region defined", function() {
      expect(this.app.footer).toBeDefined();
      expect(this.app.footer.currentView.el.isEqualNode(new FooterView().render().el)).toBeTruthy();
    });
  });
});