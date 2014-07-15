define([
  'views/error-view'
], function (ErrorView) {
  describe("ErrorView", function() {
    beforeEach(function() {
      this.view = new ErrorView();
    });

    describe(".render", function() {
      it("should render the template", function() {
        expect(this.view.el).toBeDefined();
      });
    });
  });
});