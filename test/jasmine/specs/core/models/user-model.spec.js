define([
  'models/user-model'
], function (User) {
  describe("User", function() {
    beforeEach(function() {
      this.model = new User();
    });

    describe("When instantiating a User", function() {
      beforeEach(function() {
        this.model = new User();
      });

      it("should have null ID", function() {
        expect(this.model.get('ID')).toBe(null);
      });

      it("should have an empty username", function() {
        expect(this.model.get('username')).toBe('');
      });

      it("should have an empty email", function() {
        expect(this.model.get('email')).toBe('');
      });

      it("should have an empty password", function() {
        expect(this.model.get('password')).toBe('');
      });

      it("should have an empty name", function() {
        expect(this.model.get('name')).toBe('');
      });

      it("should have an empty first_name", function() {
        expect(this.model.get('first_name')).toBe('');
      });

      it("should have an empty last_name", function() {
        expect(this.model.get('last_name')).toBe('');
      });

      it("should have an empty nickname", function() {
        expect(this.model.get('nickname')).toBe('');
      });

      it("should have an empty slug", function() {
        expect(this.model.get('slug')).toBe('');
      });

      it("should have an empty URL", function() {
        expect(this.model.get('URL')).toBe('');
      });

      it("should have an empty avatar", function() {
        expect(this.model.get('avatar')).toBe('');
      });
    });
  });
});