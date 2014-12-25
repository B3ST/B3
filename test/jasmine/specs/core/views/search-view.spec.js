/* global define */

define([
  'jquery',
  'views/search-view',
  'buses/event-bus'
], function ($, SearchView, EventBus) {
  'use strict';

  describe("SearchView", function() {
    var view, trigger;

    beforeEach(function() {
      view = new SearchView();
      view.render();
      trigger = spyOn(EventBus, 'trigger');
    });

    describe("When searching, ", function() {
      describe("starting to type any term", function () {
        it("should save the previously typed term", function() {
          view.$('input#search-site').val('b');
          view.$('input#search-site').keyup();
          view.$('input#search-site').val('a');
          expect(view.previousSearch).toEqual('b');
        });
      });

      describe("pasting a term", function () {
        it("should save the previously typed term", function() {
          view.$('input#search-site').val('before');
          view.$('input#search-site').keyup();
          view.$('input#search-site').val('after');
          expect(view.previousSearch).toEqual('before');
        });
      });

      describe("deleting all terms", function() {
        it("should trigger a search:reset when term is empty", function() {
          view.$('input#search-site').val('');
          view.$('input#search-site').keyup();
          expect(trigger).toHaveBeenCalledWith('search:reset');
        });

        it("should save the previously typed term", function() {
          view.$('input#search-site').val('before');
          view.$('input#search-site').keyup();
          view.$('input#search-site').val('');
          expect(view.previousSearch).toEqual('before');
        });
      });

      describe("typing a term that is more than 3 characters", function() {
        it("should trigger a search:lookup event after 500ms", function() {
          var clock = sinon.useFakeTimers();
          view.$('input#search-site').val('term');
          view.$('input#search-site').keyup();
          clock.tick(500);
          expect(trigger).toHaveBeenCalledWith('search:lookup', { search: 'term' });
          clock.restore();
        });
      });

      describe("pressing the enter key", function() {
        it("should trigger a search:submit event", function() {
          var e = $.Event("keyup");
          e.type = 'submit';

          view.$('input#search-site').val('term');
          view.$('input#search-site').keyup();
          view.$("input#search-site").trigger(e);
          expect(trigger).toHaveBeenCalledWith('search:submit', { search: 'term' });
        });
      });
    });
  });
});
