define([
  'models/settings-model'
], function (Settings) {
  describe("Settings", function() {
    it("should indicate the WP URL Root", function() {
      expect(Settings.get('url')).toBeDefined();
    });

    it("should carry the WP Nonce", function() {
      expect(Settings.get('nonce')).toBeDefined();
    });
  });
});