define([
  'views/not-found-view'
], function (NotFoundView) {
  describe("NotFoundView", function() {
    beforeEach(function() {
      this.view = new NotFoundView();
    });

    describe(".render", function() {
      it("should render the template", function() {
        this.view.render();
        expect(this.view.el).toBeDefined();
      });
    });
  });
});