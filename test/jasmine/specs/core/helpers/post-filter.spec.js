define([
  'helpers/post-filter'
], function (PostFilter) {
  describe("PostFilter", function() {
    beforeEach(function() {
      this.filter = new PostFilter();
    });

    it("should have serialize defined", function() {
      expect(this.filter.serialize).toBeDefined();
    });

    it("should have a default paging-schema", function() {
      expect(this.filter.get('paging-schema')).toEqual('url');
    });

    describe(".byCategory", function() {
      it("should encode using the category_name parameter", function() {
        this.filter.byCategory('name');
        expect(this.filter.serialize()).toEqual('filter[category_name]=name');
      });
    });

    describe(".byCategoryId", function() {
      it("should encode using the cat parameter", function() {
        this.filter.byCategoryId(1);
        expect(this.filter.serialize()).toEqual('filter[cat]=1');
      });
    });

    describe(".byTag", function() {
      it("should encode using the tag parameter", function() {
        this.filter.byTag('tag');
        expect(this.filter.serialize()).toEqual('filter[tag]=tag');
      });
    });

    describe(".byAuthor", function() {
      it("should encode using the author_name parameter", function() {
        this.filter.byAuthor('author');
        expect(this.filter.serialize()).toEqual('filter[author_name]=author');
      });
    });

    describe(".byAuthorId", function() {
      it("should encode using the author parameter", function() {
        this.filter.byAuthorId(1);
        expect(this.filter.serialize()).toEqual('filter[author]=1');
      });
    });

    describe(".bySearchingFor", function() {
      it("should encode using the s parameter", function() {
        this.filter.bySearchingFor('search term');
        expect(this.filter.serialize()).toEqual('filter[s]=search+term');
      });
    });

    describe(".onPage", function() {
      it("should encode using the page parameter", function() {
        this.filter.onPage(1);
        expect(this.filter.serialize()).toEqual('page=1');
      });
    });

    describe(".perPage", function() {
      it("should encode using the posts_per_page parameter", function() {
        this.filter.perPage(10);
        expect(this.filter.serialize()).toEqual('filter[posts_per_page]=10');
      });
    });

    describe(".all", function() {
      it("should encode using the posts_per_page parameter", function() {
        this.filter.all();
        expect(this.filter.serialize()).toEqual('filter[posts_per_page]=-1');
      });
    });

    describe("When chaining methods", function() {
      it("should return the parameters in the same query", function() {
        this.filter.byCategory('name').onPage(1).perPage(10);
        expect(this.filter.serialize()).toEqual('filter[category_name]=name&filter[posts_per_page]=10&page=1');
      });
    });
  });
});