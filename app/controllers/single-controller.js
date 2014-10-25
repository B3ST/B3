/* globals define */

define([
  'controllers/base-controller',
  'controllers/pagination-controller',
  'controllers/comments-controller',
  'controllers/reply-form-controller',
  'views/single-post-view',
  'models/settings-model',
  'buses/event-bus',
  'buses/navigator'
], function (BaseController, PaginationController, CommentsController, ReplyFormController, SinglePostView, Settings, EventBus, Navigator) {
  'use strict';

  var SingleController = BaseController.extend({
    busEvents: {
      'single:view:display:category': 'showTaxonomy',
      'single:view:display:tag':      'showTaxonomy',
      'single:view:display:author':   'showAuthor',
      'single:view:display:page':     'showPage',
      'single:view:display:taxonomy': 'navigateToLink',
      'single:view:link:clicked':     'navigateToLink',

      'pagination:next:page':         'showPageContent',
      'pagination:previous:page':     'showPageContent',
      'pagination:select:page':       'showPageContent'
    },

    childControllers: {
      pagination: 'paginationController',
      comments:   'commentsController'
    },

    initialize: function (options) {
      options           = options || {};
      this.model        = options.model;
      this.template     = options.template;
      this.page         = options.page || 1;
      this.splitContent = options.splitContent || [];
    },

    showSingle: function () {
      this.show(null, {
        loading: {
          entities: [this.model],
          done: this.onFetchDone.bind(this),
          fail: this.onFetchFail.bind(this)
        }
      });
    },

    onFetchDone: function () {
      if (Settings.get('page_for_posts') === this.model.get('ID')) {
        EventBus.trigger('archive:show', {});
        return;
      }

      var content = this.model.get('content').split(/<!--nextpage-->/),
          pages   = content.length;

      this.splitContent = content;
      this.model.set({ content: content[this.page - 1] });
      this._showLayout(pages, this.model);
    },

    onFetchFail: function () {

    },

    showPageContent: function (options) {
      if (this.page !== options.page) {
        this.page = options.page;
        this.model.set({ content: this.splitContent[this.page - 1] });
      }
    },

    showTaxonomy: function (options) {
      var taxonomy = options.type, slug = options.slug,
          page = 1, trigger = true;
      Navigator.navigateToTaxonomy(taxonomy, slug, page, trigger);
    },

    showAuthor: function (options) {
      var author = options.slug, page = 1, trigger = true;
      Navigator.navigateToAuthor(author, page, trigger);
    },

    navigateToLink: function (options) {
      Navigator.navigateToLink(options.href, true);
    },

    paginationController: function () {
      return new PaginationController();
    },

    commentsController: function () {
      return new CommentsController();
    },

    _showLayout: function (pages, model) {
      this.show(this._singleView(), { region: this.region });
      this.pagination.showPagination({ region: this.mainView.pagination, page: this.page, pages: pages, include: true });
      this.comments.showComments({ region: this.mainView.comments, model: model });
    },

    _singleView: function () {
      return new SinglePostView({ model: this.model, template: this.template, page: this.page });
    }
  });

  return SingleController;
});
