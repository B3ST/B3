/* global define */

define([
  'buses/navigator',
  'buses/event-bus',
  'models/settings-model',
  'models/post-model'
], function (Navigator, EventBus, Settings, Post) {
  'use strict';

  var bus;

  describe('Navigator', function() {
    beforeEach(function() {
      var routes = getJSONFixture('route.json');
      Settings.set('routes', routes);
      bus = spyOn(EventBus, 'trigger');
    });

    describe('.initialize', function() {
      it('should set the default routes', function() {
        Navigator.initialize();

        expect(Navigator.routes.root[0]).toEqual('(/page/{paged})');
        expect(Navigator.routes.page[0]).toEqual('{page}(/page/{paged})');
        expect(Navigator.routes.post[0]).toEqual('post/{post}(/page/{paged})');
        expect(Navigator.routes.date).toEqual([
          'post/{year}(/page/{paged})',
          'post/{year}/{monthnum}(/page/{paged})',
          'post/{year}/{monthnum}/{day}(/page/{paged})'
        ]);
        expect(Navigator.routes.author[0]).toEqual('post/author/{author}(/page/{paged})');
        expect(Navigator.routes.category[0]).toEqual('post/category/{category}(/page/{paged})');
        expect(Navigator.routes.post_tag[0]).toEqual('post/tag/{post_tag}(/page/{paged})');
        expect(Navigator.routes.post_format[0]).toEqual('post/type/{post_format}(/page/{paged})');
        expect(Navigator.routes.search[0]).toEqual('search/{search}(/page/{paged})');
      });
    });

    describe('.navigate', function() {
      it('should trigger an event of router:nav', function() {
        Navigator.navigate('route', false);
        expect(bus).toHaveBeenCalledWith('router:nav', {route: 'route', options: {trigger: false}});
      });
    });

    describe('.navigateToLink', function() {
      describe('When link is internal', function() {
        it('should navigate to that link', function() {
          Navigator.navigateToLink(Settings.get('site_url') + '/post/post', true);
          expect(bus).toHaveBeenCalledWith('router:nav', {route: 'post/post', options: { trigger: true }});
        });
      });

      describe('When link is external', function() {
        it('should open a new window', function() {
          var open = spyOn(window, 'open');
          Navigator.navigateToLink('http://local.pt/', true);
          expect(open).toHaveBeenCalledWith('http://local.pt/');
        });
      });
    });

    describe('.navigateToHome', function() {
      it('should trigger an event of router:nav to a \'\' route', function() {
        Navigator.navigateToHome('', null, false);
        expect(bus).toHaveBeenCalledWith('router:nav', {route: '', options: { trigger: false }});
      });

      describe('When specifying a page', function() {
        it('should trigger an event of router:nav to a \'\' route', function() {
          Navigator.navigateToHome('', 2, false);
          expect(bus).toHaveBeenCalledWith('router:nav', {route: '/page/2', options: { trigger: false }});
        });
      });
    });

    describe('.getAuthorLink', function() {
      it('should return the authors link', function() {
        expect(Navigator.getAuthorLink('author')).toEqual('post/author/author');
      });
    });
  });
});
