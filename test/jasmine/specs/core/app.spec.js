define([
  'app',
  'models/settings-model',
  'views/header-view',
  'views/footer-view',
  'sinon'
], function (App, Settings, HeaderView, FooterView) {
  xdescribe("App", function() {
    beforeEach(function() {
      var server = sinon.fakeServer.create();
      var response = { primary: { location: "primary", name: "Primary Menu", meta: { links: { self: "http://localhost:8888/wordpress/wp-json/b3:menus/primary", collection: "http://localhost:8888/wordpress/wp-json/b3:menus"}}}};
      server.respondWith(
        'GET',
        Settings.get('apiUrl') + '/b3:menus',
        [200, {'Content-Type': 'application/json'}, JSON.stringify(response)]
      );
      App.start();
      server.respond();
    });

    it("should have an header region defined", function() {
      expect(App.header).toBeDefined();
      expect(App.header.currentView.el.isEqualNode(new HeaderView({}).render().el)).toBeTruthy();
    });

    it("should have a main region defined", function() {
      expect(App.main).toBeDefined();
    });

    it("should have a footer region defined", function() {
      expect(App.footer).toBeDefined();
      expect(App.footer.currentView.el.isEqualNode(new FooterView().render().el)).toBeTruthy();
    });
  });
});
