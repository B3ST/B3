define([
  'app',
  'views/header-view',
  'views/footer-view'
], function (App, HeaderView, FooterView) {
  describe("App", function() {
    beforeEach(function() {
      this.app = App;
    });

    it("should have an header region defined", function() {
      var header = new HeaderView();

      expect(this.app.header).toBeDefined();
      expect(this.app.header.currentView.el.isEqualNode(header.render().el)).toBeTruthy();
    });

    it("should have a main region defined", function() {
      expect(this.app.main).toBeDefined();
    });

    it("should have a footer region defined", function() {
      var footer = new FooterView();

      expect(this.app.footer).toBeDefined();
      expect(this.app.footer.currentView.el.isEqualNode(footer.render().el)).toBeTruthy();
    });
  });
});