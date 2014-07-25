define([
  'helpers/post-filter'
], function (PostFilter) {
  describe("PostFilter", function() {
    beforeEach(function() {
      this.filter = new PostFilter();
    });

    describe(".byCategory", function() {
      // e.g.: decodeURIComponent($.param({filter: {category_name: 'sticky'}}))
      it("should encode using the cat parameter", function() {
        this.filter.byCategory();
      });
    });

    describe(".byCategorySlug", function() {
      it("should encode using the category_name parameter", function() {
        this.filter.byCategorySlug();
      });
    });

    describe(".andCategory", function() {
      it("should encode using the category__and parameter", function() {
        this.filter.byCategorySlug();
      });
    });

    describe(".inCategory", function() {
      it("should encode using the category__in parameter", function() {
        this.filter.inCategory();
      });
    });

    describe(".notInCategory", function() {
      it("should encode using the category__not parameter", function() {
        this.filter.notInCategory();
      });
    });
  });
});