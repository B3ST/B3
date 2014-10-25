/* global define */

define([
  'helpers/post-filter'
], function (PostFilter) {
  'use strict';

  describe("PostFilter", function() {
    var filter;

    beforeEach(function() {
      filter = new PostFilter();
    });

    it("should have serialize defined", function() {
      expect(filter.serialize).toBeDefined();
    });

    it("should have a default paging-schema", function() {
      expect(filter.get('paging-schema')).toEqual('url');
    });

    describe(".byCategory", function() {
      it("should encode using the category_name parameter", function() {
        filter.byCategory('name');
        expect(filter.serialize()).toEqual('filter[category_name]=name');
      });
    });

    describe(".byCategoryId", function() {
      it("should encode using the cat parameter", function() {
        filter.byCategoryId(1);
        expect(filter.serialize()).toEqual('filter[cat]=1');
      });
    });

    describe(".byTag", function() {
      it("should encode using the tag parameter", function() {
        filter.byTag('tag');
        expect(filter.serialize()).toEqual('filter[tag]=tag');
      });
    });

    describe(".byAuthor", function() {
      it("should encode using the author_name parameter", function() {
        filter.byAuthor('author');
        expect(filter.serialize()).toEqual('filter[author_name]=author');
      });
    });

    describe(".byAuthorId", function() {
      it("should encode using the author parameter", function() {
        filter.byAuthorId(1);
        expect(filter.serialize()).toEqual('filter[author]=1');
      });
    });

    describe(".bySearchingFor", function() {
      it("should encode using the s parameter", function() {
        filter.bySearchingFor('search term');
        expect(filter.serialize()).toEqual('filter[s]=search+term');
      });
    });

    describe(".withYear", function() {
      it("should encode using the year parameter", function() {
        filter.withYear('2013');
        expect(filter.serialize()).toEqual('filter[year]=2013');
      });
    });

    describe(".withMonth", function() {
      it("should encode using the month parameter", function() {
        filter.withMonth('03');
        expect(filter.serialize()).toEqual('filter[month]=03');
      });
    });

    describe(".withDay", function() {
      it("should encode using the day parameter", function() {
        filter.withDay('12');
        expect(filter.serialize()).toEqual('filter[day]=12') ;
      });
    });

    describe(".withDate", function() {
      it("should encode using the given parameters", function() {
        filter.withDate({ year: '2014', monthnum: '02', day: '12' });
        expect(filter.serialize()).toEqual('filter[year]=2014&filter[month]=02&filter[day]=12');
      });
    });

    describe(".withTaxonomy", function() {
      it("should encode using the given parameters", function() {
        filter.withTaxonomy({ 'jetpack-portfolio-tag': 'tagged' });
        expect(filter.serialize()).toEqual('filter[taxonomy]=jetpack-portfolio-tag&filter[term]=tagged');
      });
    });

    describe(".byType", function() {
      it("should encode using the given type", function() {
        filter.byType('jetpack-portfolio');
        expect(filter.serialize()).toEqual('type=jetpack-portfolio');
      });
    });

    describe(".onPage", function() {
      it("should encode using the page parameter", function() {
        filter.onPage(1);
        expect(filter.serialize()).toEqual('page=1');
      });
    });

    describe(".perPage", function() {
      it("should encode using the posts_per_page parameter", function() {
        filter.perPage(10);
        expect(filter.serialize()).toEqual('filter[posts_per_page]=10');
      });
    });

    describe(".all", function() {
      it("should encode using the posts_per_page parameter", function() {
        filter.all();
        expect(filter.serialize()).toEqual('filter[posts_per_page]=-1');
      });
    });

    describe("When chaining methods", function() {
      it("should return the parameters in the same query", function() {
        filter.byCategory('name').onPage(1).perPage(10);
        expect(filter.serialize()).toEqual('filter[category_name]=name&filter[posts_per_page]=10&page=1');
      });
    });
  });
});
