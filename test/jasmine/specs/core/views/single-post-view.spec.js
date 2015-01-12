/* global define, sinon, describe, beforeEach, expect, it, spyOn */

define([
  'views/single-post-view',
  'buses/event-bus',
  'buses/navigator',
  'models/user-model',
  'models/post-model',
], function (SinglePostView, EventBus, Navigator, User, Post) {
  'use strict';

  describe('SinglePostView', function() {
    var user, view, post, options;

    beforeEach(function() {
      post    = new Post({ID: 1, title: 'Title', content: '<a href="http://wordpress.example.org/post/category/content">link</a>', author: new User({ID: 1, slug: 'author-1', name: 'author-name'}), terms: {portfolio: [{ ID: 1, slug: 'post-1', link: 'http://wordpress.example.org/post/portfolio/content' }], category: {ID: 1, slug: 'post-1', link: 'http://wordpress.example.org/post/category/content'}, post_tag: {ID: 1, slug: 'tag-1', link: 'http://wordpress.example.org/post/tag/content'}}});
      options = { model: post, template: 'content/type-post-template.dust' };
    });

    describe('.initialize', function() {
      var bus;

      beforeEach(function() {
        bus  = spyOn(EventBus, 'trigger');
        view = new SinglePostView(options);
      });

      it('should set the document title', function () {
        expect(bus).toHaveBeenCalledWith('title:change', 'Title');
      });
    });

    using('Single Post links',
      [{ title: 'content', ui: '.post-content > a' },
       { title: 'taxonomy', ui: '.taxonomy > a' },
       { title: 'category', ui: '.category > a' },
       { title: 'tag', ui: '.tag > a' },
       { title: 'author', ui: '.author > a' },
       { title: 'author', ui: '#author > a' }], function (data) {
      describe('When clicking in a ' + data.title + ' link', function() {
        it('should navigate to the given link', function() {
          var navigate = spyOn(Navigator, 'navigateToLink'),
              view    = new SinglePostView({ model: post, template: 'content/type-post-template.dust' }), link;

          view.render();
          link = view.$(data.ui).first();
          link.click();

          expect(navigate).toHaveBeenCalledWith(link.attr('href'), true);
        });
      });
    });
  });
});
