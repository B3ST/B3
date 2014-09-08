/* global define */

define([
  'controllers/taxonomy-controller',
  'buses/request-bus',
  'collections/taxonomy-collection',
  'models/taxonomy-model',
  'models/settings-model',
  'sinon'
], function (TaxonomyController, RequestBus, Taxonomies, Taxonomy, Settings) {
  'use strict';

  describe("TaxonomyController", function() {
    describe(".initialize", function() {
      it("should set an handler for taxonomy:get", function() {
        var request    = spyOn(RequestBus, 'setHandler');
        var controller = taxonomyController();

        expect(request).toHaveBeenCalledWith('taxonomy:get', controller.getTaxonomy);
      });
    });

    describe(".getTaxonomy", function() {
      it("should return a promise", function() {
        var tax = new Taxonomy({slug: 'category', meta: {links: { archives: Settings.get('api_url') + '/taxonomies/category/terms' }}});
        var controller = taxonomyController();
        controller.taxonomies = new Taxonomies([tax]);

        var taxonomy = controller.getTaxonomy({taxonomy: 'category', term: 'cat'});
        expect(taxonomy).toEqual(jasmine.any(Object));
      });
    });
  });

  function taxonomyController () {
    return new TaxonomyController({
      taxonomies: new Taxonomies()
    });
  }
});