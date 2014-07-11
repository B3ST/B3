define([
  'views/footer-view'
], function (FooterView) {
  describe("FooterView", function() {
    beforeEach(function() {
      this.view = new FooterView();
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view.render();
        expect(this.view.el).toBeDefined();
      });
    });
  });
});