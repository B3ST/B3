/* global define */

define([
  'controllers/search-controller',
  'controllers/base-controller',
  'controllers/archive-controller',
  'views/search-view',
  'helpers/post-filter',
  'buses/command-bus',
  'buses/navigator'
], function (SearchController, BaseController, ArchiveController, SearchView, PostFilter, CommandBus, Navigator) {
  'use strict';

  describe('SearchController', function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { region: region };
    });

    it('should extend from BaseController', function() {
      expect(inherits(SearchController, BaseController)).toBeTruthy();
    });

    it('should bind to a given set of events', function() {
      controller = new SearchController();
      expect(controller.busEvents).toEqual({
        'search:lookup': 'searchTerm',
        'search:submit': 'navigateSearchUrl',
        'search:reset':  'teardownSearch'
      });
    });

    describe('When initializing', function() {
      it('should bind to a search:term command', function() {
        var handler = spyOn(CommandBus, 'setHandler');

        controller = new SearchController();
        expect(handler).toHaveBeenCalledWith('search:term', controller.searchTerm, controller);
      });
    });

    describe('.showSearch', function() {
      it('should display a SearchView', function() {
        var show = spyOn(SearchController.prototype, 'show');

        controller = new SearchController();
        controller.showSearch(options);

        expect(show).toHaveBeenCalledWith(jasmine.any(SearchView), { region: options.region });
      });
    });

    describe('.searchTerm', function() {
      var filter, show;

      beforeEach(function() {
        controller = new SearchController({ filter: new PostFilter() });
        filter = spyOn(controller.filter, 'bySearchingFor').and.callThrough();
        show = spyOn(ArchiveController.prototype, 'showArchive');
      });

      it('should setup the filter', function() {
        controller.searchTerm({ search: 'term' });
        expect(filter).toHaveBeenCalledWith('term');
      });

      it('should call showArchive in archive controller if it was not previously loaded', function() {
        controller.searchTerm({ search: 'term' });
        expect(show).toHaveBeenCalled();
      });
    });

    describe('.navigateSearchUrl', function() {
      it('should navigate to the given search', function() {
        var navigate = spyOn(Navigator, 'navigateToSearch');

        controller = new SearchController();
        controller.navigateSearchUrl({ search: 'search' });

        expect(navigate).toHaveBeenCalledWith('search', null, false);
      });
    });

    describe('.teardownSearch', function() {
      var navigate, reset;

      beforeEach(function() {
        navigate = spyOn(Navigator, 'navigateToCurrent');
        controller = new SearchController();
        reset = spyOn(controller.posts, 'reset');
        controller.teardownSearch();
      });

      it('should reset the posts', function() {
        expect(reset).toHaveBeenCalled();
      });

      it('should navigate to the current URL', function() {
        expect(navigate).toHaveBeenCalled();
      });
    });
  });
});
