define([
  'app'
], function (App) {
  describe("App", function() {
    beforeEach(function() {
      this.app = App;
    });

    it("should have a main region defined", function() {
      expect(this.app.main).toBeDefined();
    });
  });
});