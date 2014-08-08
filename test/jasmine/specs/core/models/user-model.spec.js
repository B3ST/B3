define([
  'models/user-model',
  'models/settings-model',
  'sinon'
], function (User, Settings) {
  describe("User", function() {
    beforeEach(function() {
      this.model = new User();
    });

    describe("When instantiating a User", function() {
      it("should have null ID", function() {
        expect(this.model.get('ID')).toBe(null);
      });

      using('model fields', ['username', 'email', 'password', 'name', 'first_name', 'last_name', 'nickname', 'slug', 'URL', 'avatar'], function (field) {
        it("should have an empty " + field, function() {
          expect(this.model.get(field)).toBe('');
        });
      });
    });

    describe("When fetching users", function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create();
        this.model  = new User({ID: 1});
      });

      afterEach(function() {
        this.server.restore();
      });

      describe("When fetching is successful", function() {
        it("should set its attributes", function() {
          var response = {
            ID: 1,
            username: 'wordpress',
            email: 'generic@wordpress.org',
            password: '',
            name: 'WordPress',
            first_name: 'Word',
            last_name: 'Press',
            nickname: 'The WordPresser',
            slug: 'wordpress',
            URL: 'http://wordpress.org',
            avatar: 'http://s.w.org/style/images/wp-header-logo-2x.png?1'
          };

          this.server.respondWith(
            'GET',
            Settings.get('api_url') + '/users/1',
            [200, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          expect(this.model.get('username')).toBe('wordpress');
          expect(this.model.get('email')).toBe('generic@wordpress.org');
        });
      });

      describe("When fetching fails", function() {
        it("should maintain its attributes", function() {
          var response = '';
          this.server.respondWith(
            'GET',
            Settings.get('api_url') + '/users/1',
            [404, { 'Content-Type': 'application/json' }, JSON.stringify(response)]
          );

          this.model.fetch();
          this.server.respond();

          var empty = new User({ID: 1});
          expect(this.model.attributes).toEqual(this.model.attributes);
        });
      });
    });
  });
});
