define([
  'controllers/controller',
  'models/settings-model',
  'collections/post-collection',
  'app',
  'sinon'
], function (Controller, Settings, Posts, App) {
  describe("Controller", function() {
    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.server.respondWith(
        'GET',
        Settings.get('url') + '/posts',
        [200, {'Content-Type': 'application/json'}, JSON.stringify([])]
      );
    });

    describe(".index", function() {
      it("should fetch the collection of posts", function() {
        this.spy = spyOn(Posts.prototype, 'fetch');
        this.app = { main: { show: function () {} }};
        this.controller = new Controller({
          posts: new Posts(),
          app:   this.app
        });

        this.controller.index();
        this.server.respond();

        expect(this.spy).wasCalled();
      });

      it("should show the content view", function() {
        App.addRegions({
          main: '#main'
        });
        this.controller = new Controller({
          posts: new Posts(),
          app:   App
        });

        this.controller.index();
        this.server.respond();

        expect(App.main.currentView.el).toBeDefined;
      });
    });
  });
});