define([
  'collections/user-collection'
], function (Users) {
  describe("Users", function() {
    beforeEach(function() {
      this.users = new Users();
    });

    it("should be defined", function() {
      expect(this.users).toBeDefined();
    });
  });
});