define([
  'views/archive-view',
  'models/settings-model',
  'models/post-model',
  'collections/post-collection',
  'controllers/event-bus',
  'controllers/navigator',
  'sinon'
], function (ArchiveView, Settings, Post, Posts, EventBus, Navigator) {
  'use strict';

  describe("ArchiveView", function() {
    beforeEach(function() {
      this.posts = new Posts([
        new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1'}),
        new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2'})
      ]);

      this.view = new ArchiveView({collection: this.posts});
      this.view.render();
    });

    describe(".render", function() {
      it("should render the template", function() {
        expect(this.view.$el.children('.b3-post').length).toEqual(2);
      });
    });

    describe("When the collection changes", function() {
      it("should re-render the view", function() {
        this.posts.reset();
        expect(this.view.$el.children('.b3-post').length).toEqual(0);
      });
    });

    describe("When clicking in title link", function() {
      beforeEach(function() {
        this.spy = spyOn(EventBus, 'trigger');
        this.posts = new Posts([
          new Post({ID: 1, title: 'title-1', excerpt: 'Excerpt 1', slug: 'post-1'}),
          new Post({ID: 2, title: 'title-2', excerpt: 'Excerpt 2', slug: 'post-2'})
        ]);

        this.view = new ArchiveView({collection: this.posts});
        this.view.render();
      });

      it("should trigger an event of navigation", function() {
        this.view.$('.b3-post-title > a').first().click();
        expect(this.spy).toHaveBeenCalledWith('router:nav', {route: 'post/post-1', options: {trigger: true}});
      });
    });

    describe("When clicking in next page", function() {
      beforeEach(function() {
        this.spy = spyOn(Navigator, 'getRoute').andCallFake(function () {
          return 'some/route/url/page/1';
        });
        this.eventbus = spyOn(EventBus, 'trigger');
        this.posts = new Posts([
          new Post({ID: 1, title: 'Sticky', excerpt: 'Excerpt 1', slug: 'post-1'}),
          new Post({ID: 2, title: 'Oh post', excerpt: 'Excerpt 2', slug: 'post-2'})
        ]);

        this.response = [{"ID":1241,"title":"Sticky","status":"publish","type":"post","author":{"ID":2,"username":"manovotny","name":"Michael Novotny","first_name":"Michael","last_name":"Novotny","nickname":"manovotny","slug":"manovotny","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/60cb31e323d15f1c0fc1a59ac17ba484?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2\/posts"}}},"content":"<p>This is a sticky post.<\/p>\n<p>There are a few things to verify:<\/p>\n<ul>\n<li>The sticky post should be distinctly\u00a0recognizable\u00a0in some way in comparison to normal posts. You can style the <code>.sticky<\/code> class if you are using the <a title=\"WordPress Codex post_class() Function\" href=\"http:\/\/codex.wordpress.org\/Function_Reference\/post_class\" target=\"_blank\">post_class()<\/a> function to generate your post classes, which is a best practice.<\/li>\n<li>They should show at the very top of the blog index page, even though they could be several posts back chronologically.<\/li>\n<li>They should still show up again in their chronologically correct postion in time, but without the sticky indicator.<\/li>\n<li>If you have a plugin or widget that lists popular posts or comments, make sure that this sticky post is not always at the top of those lists unless it really is popular.<\/li>\n<\/ul>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/sticky","date":"2013-01-07T07:07:21+00:00","modified":"2013-01-07T07:07:21+00:00","format":"standard","slug":"sticky","guid":"http:\/\/wptest.io\/demo\/?p=1241","excerpt":"<p>This is a sticky post. There are a few things to verify: The sticky post should be distinctly\u00a0recognizable\u00a0in some way in comparison to normal posts. You can style the .sticky class if you are using the post_class() function to generate your post classes, which is a best practice. They should show at the very top [&hellip;]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":true,"date_tz":"UTC","date_gmt":"2013-01-07T13:07:21+00:00","modified_tz":"UTC","modified_gmt":"2013-01-07T13:07:21+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1241","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1241\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1241\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":30,"name":"Sticky","slug":"sticky","description":"","parent":null,"count":1,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/sticky","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/30"}}}]}},{"ID":16,"title":"Oh post","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>So favorited are you gonna be[favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/oh-post","date":"2014-05-19T11:15:26+00:00","modified":"2014-05-27T17:19:16+00:00","format":"standard","slug":"oh-post","guid":"http:\/\/localhost:8888\/wordpress\/?p=16","excerpt":"<p>So favorited are you gonna be[favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-19T11:15:26+00:00","modified_tz":"UTC","modified_gmt":"2014-05-27T17:19:16+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/16\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":14,"title":"Another post to favorite","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>Yei!<\/p>\n<p>[favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/another-post-to-favorite","date":"2014-05-19T11:12:57+00:00","modified":"2014-05-27T17:17:44+00:00","format":"standard","slug":"another-post-to-favorite","guid":"http:\/\/localhost:8888\/wordpress\/?p=14","excerpt":"<p>Yei! [favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-19T11:12:57+00:00","modified_tz":"UTC","modified_gmt":"2014-05-27T17:17:44+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/14","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/14\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/14\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":11,"title":"Oh Mighty Post","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>So mighty be thee<\/p>\n<p>[favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/oh-mighty-post","date":"2014-05-13T11:29:52+00:00","modified":"2014-05-27T17:15:15+00:00","format":"standard","slug":"oh-mighty-post","guid":"http:\/\/localhost:8888\/wordpress\/?p=11","excerpt":"<p>So mighty be thee [favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-13T11:29:52+00:00","modified_tz":"UTC","modified_gmt":"2014-05-27T17:15:15+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/11","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/11\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/11\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":8,"title":"Yet another post","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>Post post post<\/p>\n<p>[favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/yet-another-post","date":"2014-05-13T10:17:41+00:00","modified":"2014-05-27T17:33:01+00:00","format":"standard","slug":"yet-another-post","guid":"http:\/\/localhost:8888\/wordpress\/?p=8","excerpt":"<p>Post post post [favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-13T10:17:41+00:00","modified_tz":"UTC","modified_gmt":"2014-05-27T17:33:01+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/8","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/8\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/8\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":6,"title":"A Post Test","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>Right here !<\/p>\n<p>[favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/a-post-test","date":"2014-05-13T10:11:01+00:00","modified":"2014-06-02T16:00:25+00:00","format":"standard","slug":"a-post-test","guid":"http:\/\/localhost:8888\/wordpress\/?p=6","excerpt":"<p>Right here ! [favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-13T10:11:01+00:00","modified_tz":"UTC","modified_gmt":"2014-06-02T16:00:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/6","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/6\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/6\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":1,"title":"Hello world!","status":"publish","type":"post","author":{"ID":1,"username":"pcruz","name":"pcruz","first_name":"","last_name":"","nickname":"pcruz","slug":"pcruz","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/430d60bade8acd61f6be9212cadb675b?s=96","description":"","registered":"2014-05-08T12:45:41+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1\/posts"}}},"content":"<p>Welcome to WordPress. This is your first post. Edit or delete it, then start blogging![favorite_button]<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/hello-world","date":"2014-05-08T12:45:41+00:00","modified":"2014-05-27T17:17:54+00:00","format":"standard","slug":"hello-world","guid":"http:\/\/localhost:8888\/wordpress\/?p=1","excerpt":"<p>Welcome to WordPress. This is your first post. Edit or delete it, then start blogging![favorite_button]<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2014-05-08T12:45:41+00:00","modified_tz":"UTC","modified_gmt":"2014-05-27T17:17:54+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/1","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":1,"name":"Uncategorized","slug":"uncategorized","description":"","parent":null,"count":8,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/uncategorized","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/1"}}}]}},{"ID":1031,"title":"Tiled Gallery","status":"publish","type":"post","author":{"ID":6,"username":"alliswell","name":"Jared Erickson","first_name":"Jared","last_name":"Erickson","nickname":"alliswell","slug":"alliswell","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/b2c1febfd11117eef66c351c1d4c10f1?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/6","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/6\/posts"}}},"content":"<p>This is a test for Jetpack&#8217;s Tiled Gallery.<\/p>\n<p>You can install <a title=\"Jetpack for WordPress\" href=\"http:\/\/jetpack.me\/\" target=\"_blank\">Jetpack<\/a> or <a title=\"Slim Jetpack\" href=\"http:\/\/wordpress.org\/extend\/plugins\/slimjetpack\/\" target=\"_blank\">Slim Jetpack<\/a> to test it out.<\/p>\n<div id='gallery-1' class='gallery galleryid-1031 gallery-columns-4 gallery-size-thumbnail'><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/man-of-steel'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/man-of-steel-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"Man Of Steel\" \/><\/a>\n\t\t\t<\/div><\/figure><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/captian-america'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/captian-america-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"Captian America\" \/><\/a>\n\t\t\t<\/div><\/figure><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/the-dark-knight-rises'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/the-dark-knight-rises-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"The Dark Knight Rises\" \/><\/a>\n\t\t\t<\/div><\/figure><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/ironman-2'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/ironman-2-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"Iron Man 2\" \/><\/a>\n\t\t\t<\/div><\/figure><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/spider-man'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/spider-man-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"The Amazing Spider Man\" \/><\/a>\n\t\t\t<\/div><\/figure><figure class='gallery-item'>\n\t\t\t<div class='gallery-icon portrait'>\n\t\t\t\t<a href='http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery\/fight-club'><img width=\"150\" height=\"150\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/fight-club-150x150.jpg\" class=\"attachment-thumbnail\" alt=\"Fight Club\" \/><\/a>\n\t\t\t<\/div><\/figure>\n\t\t<\/div>\n\n<p>This is some text after the Tiled Gallery just to make sure that everything spaces nicely.<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/tiled-gallery","date":"2013-03-15T17:23:27+00:00","modified":"2013-03-15T17:23:27+00:00","format":"standard","slug":"tiled-gallery","guid":"http:\/\/wptest.io\/demo\/?p=1031","excerpt":"<p>This is a test for Jetpack&#8217;s Tiled Gallery. You can install Jetpack or Slim Jetpack to test it out. This is some text after the Tiled Gallery just to make sure that everything spaces nicely.<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T22:23:27+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T22:23:27+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1031","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/6","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1031\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1031\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":15,"name":"Gallery","slug":"post-format-gallery","description":"Posts in this category test the gallery post format.","parent":null,"count":2,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/post-format-gallery","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/15"}}},{"ID":16,"name":"Images","slug":"images","description":"Posts in this category test images in various ways.","parent":null,"count":7,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/images","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/16"}}},{"ID":17,"name":"Jetpack","slug":"jetpack","description":"Posts in this category test Jetpack features.","parent":null,"count":3,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/jetpack","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/17"}}}]}},{"ID":1027,"title":"Twitter Embeds","status":"publish","type":"post","author":{"ID":7,"username":"jbrad","name":"Jason Bradley","first_name":"Jason","last_name":"Bradley","nickname":"jbrad","slug":"jbrad","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/af7935f33b10cec23f77b8d9717641df?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/7","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/7\/posts"}}},"content":"<blockquote class=\"twitter-tweet\" width=\"500\"><p>Doing what you \u201cknow\u201d locks you in a prison of the past. Uncertainty is the path to an innovative future.<\/p>\n<p>&mdash; Carl Smith (@carlsmith) <a href=\"https:\/\/twitter.com\/carlsmith\/statuses\/258214236126322689\">October 16, 2012<\/a><\/p><\/blockquote>\n<p><script async src=\"\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"><\/script><\/p>\n<p>This post tests WordPress&#8217; <a title=\"Twitter Embeds\" href=\"http:\/\/en.support.wordpress.com\/twitter\/twitter-embeds\/\" target=\"_blank\">Twitter Embeds<\/a> feature.<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/twitter-embeds","date":"2013-03-15T15:47:16+00:00","modified":"2013-03-15T15:47:16+00:00","format":"standard","slug":"twitter-embeds","guid":"http:\/\/wptest.io\/demo\/?p=1027","excerpt":"<p>Doing what you \u201cknow\u201d locks you in a prison of the past. Uncertainty is the path to an innovative future. &mdash; Carl Smith (@carlsmith) October 16, 2012 This post tests WordPress&#8217; Twitter Embeds feature.<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T20:47:16+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T20:47:16+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1027","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/7","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1027\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1027\/revisions"}},"featured_image":null,"terms":{"category":[{"ID":9,"name":"Content","slug":"content","description":"Posts in this category test post content.","parent":null,"count":11,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/content","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/9"}}},{"ID":11,"name":"Embeds","slug":"embeds","description":"Posts in this category test various embed codes.","parent":null,"count":2,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/embeds","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/11"}}},{"ID":33,"name":"Twitter","slug":"twitter","description":"Posts in this category test various Twitter features.","parent":null,"count":2,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/twitter","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/33"}}}]}},{"ID":1016,"title":"Featured Image (Vertical)","status":"publish","type":"post","author":{"ID":5,"username":"saddington","name":"John Saddington","first_name":"John","last_name":"Saddington","nickname":"saddington","slug":"saddington","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/2801f5145de98010dd72f1ac6d92938f?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/5","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/5\/posts"}}},"content":"<p>This post should display a\u00a0<a title=\"Featured Images\" href=\"http:\/\/en.support.wordpress.com\/featured-images\/#setting-a-featured-image\" target=\"_blank\">featured image<\/a>, if the theme\u00a0<a title=\"Post Thumbnails\" href=\"http:\/\/codex.wordpress.org\/Post_Thumbnails\" target=\"_blank\">supports it<\/a>.<\/p>\n<p>Non-square images can provide some unique styling issues.<\/p>\n<p>This post tests a vertical featured image.<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/featured-image-vertical","date":"2013-03-15T15:36:32+00:00","modified":"2013-03-15T15:36:32+00:00","format":"standard","slug":"featured-image-vertical","guid":"http:\/\/wptest.io\/demo\/?p=1016","excerpt":"<p>This post should display a\u00a0featured image, if the theme\u00a0supports it. Non-square images can provide some unique styling issues. This post tests a vertical featured image.<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T20:36:32+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T20:36:32+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1016","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/5","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1016\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1016\/revisions"}},"featured_image":{"ID":1024,"title":"Vertical Featured Image","status":"inherit","type":"attachment","author":{"ID":2,"username":"manovotny","name":"Michael Novotny","first_name":"Michael","last_name":"Novotny","nickname":"manovotny","slug":"manovotny","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/60cb31e323d15f1c0fc1a59ac17ba484?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2\/posts"}}},"content":"<p class=\"attachment\"><a href='http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg'><img width=\"155\" height=\"300\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical-155x300.jpg\" class=\"attachment-medium\" alt=\"Vertical Featured Image\" \/><\/a><\/p>\n","parent":1016,"link":"http:\/\/localhost:8888\/wordpress\/post\/featured-image-vertical\/featured-image-vertical-2","date":"2013-03-15T15:41:09+00:00","modified":"2013-03-15T15:41:09+00:00","format":"standard","slug":"featured-image-vertical-2","guid":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg","excerpt":null,"menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T20:41:09+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T20:41:09+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1024","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/media","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1024\/comments","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1024\/revisions","up":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1016"}},"terms":[],"source":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical.jpg","is_image":true,"attachment_meta":{"width":300,"height":580,"file":"2013\/03\/featured-image-vertical.jpg","sizes":{"thumbnail":{"file":"featured-image-vertical-150x150.jpg","width":150,"height":150,"mime-type":"image\/jpeg","url":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical-150x150.jpg"},"medium":{"file":"featured-image-vertical-155x300.jpg","width":155,"height":300,"mime-type":"image\/jpeg","url":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-vertical-155x300.jpg"}},"image_meta":{"aperture":0,"credit":"","camera":"","caption":"","created_timestamp":0,"copyright":"","focal_length":0,"iso":0,"shutter_speed":0,"title":""}}},"terms":{"category":[{"ID":7,"name":"Codex","slug":"codex","description":"Posts in this category contain Codex references.","parent":null,"count":3,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/codex","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/7"}}},{"ID":10,"name":"Corner Case","slug":"corner-case","description":"Posts in this category test odd corner cases, using uncovered by rare user workflows.","parent":null,"count":4,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/corner-case","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/10"}}},{"ID":13,"name":"Featured Images","slug":"featured-images","description":"Posts in this category test featured images.","parent":null,"count":3,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/featured-images","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/13"}}},{"ID":16,"name":"Images","slug":"images","description":"Posts in this category test images in various ways.","parent":null,"count":7,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/images","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/16"}}}]}},{"ID":1011,"title":"Featured Image (Horizontal)","status":"publish","type":"post","author":{"ID":4,"username":"tommcfarlin","name":"Tom McFarlin","first_name":"Tom","last_name":"McFarlin","nickname":"tommcfarlin","slug":"tommcfarlin","URL":"","avatar":"http:\/\/1.gravatar.com\/avatar\/1f0b00b8853cf0311888bb3ed2a77ebc?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/4","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/4\/posts"}}},"content":"<p>This post should display a <a title=\"Featured Images\" href=\"http:\/\/en.support.wordpress.com\/featured-images\/#setting-a-featured-image\" target=\"_blank\">featured image<\/a>, if the theme <a title=\"Post Thumbnails\" href=\"http:\/\/codex.wordpress.org\/Post_Thumbnails\" target=\"_blank\">supports it<\/a>.<\/p>\n<p>Non-square images can provide some unique styling issues.<\/p>\n<p>This post tests a horizontal featured image.<\/p>\n","parent":0,"link":"http:\/\/localhost:8888\/wordpress\/post\/featured-image-horizontal","date":"2013-03-15T15:15:12+00:00","modified":"2013-03-15T15:15:12+00:00","format":"standard","slug":"featured-image-horizontal","guid":"http:\/\/wptest.io\/demo\/?p=1011","excerpt":"<p>This post should display a featured image, if the theme supports it. Non-square images can provide some unique styling issues. This post tests a horizontal featured image.<\/p>\n","menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T20:15:12+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T20:15:12+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1011","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/4","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1011\/b3:replies","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/posts\/1011\/revisions"}},"featured_image":{"ID":1022,"title":"Horizontal Featured Image","status":"inherit","type":"attachment","author":{"ID":2,"username":"manovotny","name":"Michael Novotny","first_name":"Michael","last_name":"Novotny","nickname":"manovotny","slug":"manovotny","URL":"","avatar":"http:\/\/0.gravatar.com\/avatar\/60cb31e323d15f1c0fc1a59ac17ba484?s=96","description":"","registered":"2014-07-21T13:51:25+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","archives":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2\/posts"}}},"content":"<p class=\"attachment\"><a href='http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal.jpg'><img width=\"300\" height=\"155\" src=\"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal-300x155.jpg\" class=\"attachment-medium\" alt=\"Horizontal Featured Image\" \/><\/a><\/p>\n","parent":1011,"link":"http:\/\/localhost:8888\/wordpress\/post\/featured-image-horizontal\/featured-image-horizontal-2","date":"2013-03-15T15:40:38+00:00","modified":"2013-03-15T15:40:38+00:00","format":"standard","slug":"featured-image-horizontal-2","guid":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal.jpg","excerpt":null,"menu_order":0,"comment_status":"open","ping_status":"open","sticky":false,"date_tz":"UTC","date_gmt":"2013-03-15T20:40:38+00:00","modified_tz":"UTC","modified_gmt":"2013-03-15T20:40:38+00:00","meta":{"links":{"self":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1022","author":"http:\/\/localhost:8888\/wordpress\/wp-json\/users\/2","collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/media","replies":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1022\/comments","version-history":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1022\/revisions","up":"http:\/\/localhost:8888\/wordpress\/wp-json\/media\/1011"}},"terms":[],"source":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal.jpg","is_image":true,"attachment_meta":{"width":580,"height":300,"file":"2013\/03\/featured-image-horizontal.jpg","sizes":{"thumbnail":{"file":"featured-image-horizontal-150x150.jpg","width":150,"height":150,"mime-type":"image\/jpeg","url":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal-150x150.jpg"},"medium":{"file":"featured-image-horizontal-300x155.jpg","width":300,"height":155,"mime-type":"image\/jpeg","url":"http:\/\/localhost:8888\/wordpress\/wp-content\/uploads\/2013\/03\/featured-image-horizontal-300x155.jpg"}},"image_meta":{"aperture":0,"credit":"","camera":"","caption":"","created_timestamp":0,"copyright":"","focal_length":0,"iso":0,"shutter_speed":0,"title":""}}},"terms":{"category":[{"ID":7,"name":"Codex","slug":"codex","description":"Posts in this category contain Codex references.","parent":null,"count":3,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/codex","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/7"}}},{"ID":10,"name":"Corner Case","slug":"corner-case","description":"Posts in this category test odd corner cases, using uncovered by rare user workflows.","parent":null,"count":4,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/corner-case","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/10"}}},{"ID":13,"name":"Featured Images","slug":"featured-images","description":"Posts in this category test featured images.","parent":null,"count":3,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/featured-images","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/13"}}},{"ID":16,"name":"Images","slug":"images","description":"Posts in this category test images in various ways.","parent":null,"count":7,"link":"http:\/\/localhost:8888\/wordpress\/post\/category\/images","meta":{"links":{"collection":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms","self":"http:\/\/localhost:8888\/wordpress\/wp-json\/taxonomies\/category\/terms\/16"}}}]}}]
        this.server = sinon.fakeServer.create();
        this.server.respondWith(
          'GET',
          Settings.get('apiUrl') + '/posts?page=2',
          [200, {'Content-Type': 'application/json'}, JSON.stringify(this.response)]
        );

        this.view = new ArchiveView({collection: this.posts, limit: 2});
        this.view.render();

        this.view.$('.pager .next a').click();
        this.server.respond();
      });

      it("should render the page with the new results", function() {
        var posts = this.view.$el.children('.b3-post');
        expect($(posts[0]).find('.b3-post-title').text()).toEqual(this.response[0].title);
        expect($(posts[1]).find('.b3-post-title').text()).toEqual(this.response[1].title);
      });

      it("should navigate to page/<id> URL", function() {
        var page = this.view.page;
        expect(this.eventbus).toHaveBeenCalledWith('router:nav', {route: 'some/route/url/page/' + page, options: {trigger: false}});
      });
    });
  });

});
