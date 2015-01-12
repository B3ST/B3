/* global define */

define([
  'backbone',
  'controllers/archive-controller',
  'controllers/base-controller',
  'buses/navigator',
  'collections/post-collection',
  'models/post-model',
  'models/user-model'
], function (Backbone, ArchiveController, BaseController, Navigator, Posts, Post, User) {
  'use strict';

  describe('ArchiveController', function() {
    var app, controller, options, user, region, post;

    beforeEach(function() {
      post    = new Post({ID: 1, slug: 'post'});
      user    = new User({ID: 1, email: 'email', name: 'name'}),
      region  = jasmine.createSpyObj('region', ['show']);
      options = { region: region };
    });

    it('should inherit from BaseController', function() {
      expect(inherits(ArchiveController, BaseController)).toBeTruthy();
    });

    it('should bind to a given set of events', function() {
      controller = new ArchiveController({});
      expect(controller.busEvents).toEqual({
        'archive:show':                  'showArchive',
        'pagination:previous:page':      'showPage',
        'pagination:next:page':          'showPage',
        'pagination:select:page':        'showPage'
      });
    });

    it('should have a set of child controllers', function() {
      controller = new ArchiveController({});
      expect(controller.childControllers).toEqual({
        pagination: 'paginationController'
      });
    });

    describe('.showArchive', function() {
      var server, bus, posts, show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, 'show');
        controller = new ArchiveController(options);
      });

      it('should request all posts', function() {
        controller.showArchive();
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            entities: [controller.posts],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });

      describe('When fetching is successful', function() {
        var showView;
        beforeEach(function() {
          showView = spyOn(ArchiveController.prototype, 'showView');
          show.and.callFake(function (view, options) {
            var jqXHR = jasmine.createSpyObj('jqXHR', ['getResponseHeader']);
            jqXHR.getResponseHeader.and.callFake(function () {
              return '10';
            });
            options.loading.done([], '', jqXHR);
          });

          controller = new ArchiveController(options);
          controller.showArchive();
        });

        it('should show the archive view', function() {
          expect(showView).toHaveBeenCalledWith(10, {});
        });
      });
    });

    describe('.showPage', function() {
      var show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, 'show');
        controller = new ArchiveController(options);
      });

      it('should request all posts', function() {
        controller.showPage({ page: 2 });
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            style: 'opacity',
            entities: [controller.posts],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });

      describe('When fetching is successful', function() {
        it('should navigate to the second page', function() {
          var navigate = spyOn(Navigator, 'navigate');
          Backbone.history.fragment = '/wordpress/page/1';
          show.and.callFake(function (view, options) {
            options.loading.done();
          });

          controller.showPage({ page: 2 });
          expect(navigate).toHaveBeenCalledWith('/wordpress/page/2', false);
        });
      });
    });

    describe('.showPostByAuthor', function() {
      it('should navigate to the authors posts', function() {
        var navigate = spyOn(Navigator, 'navigateToAuthor');
        controller = new ArchiveController(options);

        controller.showPostsByAuthor({ slug: 'author' });
        expect(navigate).toHaveBeenCalledWith('author', 1, true);
      });
    });

  });
});