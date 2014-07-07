define([
  'collections/media-collection'
], function (Medias) {
  describe("Medias", function() {
    beforeEach(function() {
      this.medias = new Medias();
    });

    it("should be defined", function() {
      expect(this.medias).toBeDefined();
    });
  });
});