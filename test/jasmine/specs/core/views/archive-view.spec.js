define([
  'views/archive-view',
  'models/settings-model',
  'models/taxonomy-model',
  'models/post-model',
  'models/user-model',
  'collections/post-collection',
  'buses/navigator'
], function (ArchiveView, Settings, Taxonomy, Post, User, Posts, Navigator) {
  'use strict';

  describe("ArchiveView", function() {
    var view, posts, model;

    beforeEach(function() {
      model = new Taxonomy({ name: 'Title', slug: 'title' });
      posts = new Posts([
        new Post({ID: 1, title: 'Sticky', excerpt: 'Excerpt 1 <a href="http://wordpress.example.org/some-href">link</a>', link: 'http://wordpress.example.org/post-1', author: new User({ID: 1, slug: 'author-1', name: 'author-name'}), terms: { portfolio: [{ID: 1, slug: 'post-1', link: 'http://wordpress.example.org/post/portfolio/content'}], category: {ID: 1, slug: 'post-1', link: "http://wordpress.example.org/post/category/content"}, post_tag: {ID: 1, slug: 'tag-1', link: "http://wordpress.example.org/post/tag/content"}}}),
        new Post({ID: 2, title: 'Oh post', excerpt: 'Excerpt 2', link: 'http://wordpress.example.org/post-2', author: new User({ID: 1, slug: 'author-2', name: 'author-name'}), terms: {category: {ID: 1, slug: 'post-2', link: "http://wordpress.example.org/post/category/content"}, post_tag: {ID: 2, slug: 'tag-2', link: "http://wordpress.example.org/post/tag/content"}}})
      ]);
    });

    describe(".render", function() {
      it("should render the template", function() {
        view = new ArchiveView({ collection: posts, options: model });
        view.render();

        expect(view.$('.post').length).toEqual(2);
      });
    });

    describe("When the collection changes", function() {
      it("should re-render the view", function() {
        view = new ArchiveView({ collection: posts, options: model });
        view.render();
        posts.reset();

        expect(view.$('.post').length).toEqual(0);
      });
    });

    using('Archive links',
      [{ title: 'title', ui: '.title > a' },
       { title: 'taxonomy', ui: '.taxonomy > a' },
       { title: 'category', ui: '.category > a' },
       { title: 'tag', ui: '.tag > a' },
       { title: 'excerpt', ui: '.excerpt > a' },
       { title: 'author', ui: '.author > a' }], function (data) {
      describe('When clicking in a ' + data.title + ' link', function() {
        it('should navigate to the given post', function() {
          var navigate = spyOn(Navigator, 'navigateToLink'), link;

          view = new ArchiveView({ collection: posts, options: model });
          view.render();
          link = view.$(data.ui).first();
          link.click();

          expect(navigate).toHaveBeenCalledWith(link.attr('href'), true);
        });
      });
    });
  });
});
