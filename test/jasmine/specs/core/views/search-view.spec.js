/* global define */

define([
  'jquery',
  'views/search-view',
  'controllers/bus/event-bus',
  'controllers/navigation/navigator'
], function ($, SearchView, EventBus, Navigator) {
  'use strict';

  describe("SearchView", function() {
    beforeEach(function() {
      spyOn(Navigator, 'getRoute').andCallFake(function () {
        return 'some/url';
      });
      this.view = new SearchView({});
      this.view.render();
    });

    describe("When searching, ", function() {
      beforeEach(function() {
        this.bus = spyOn(EventBus, 'trigger');
      });

      describe("starting to type any term", function () {

        it("should trigger a search:view:start event", function() {
          this.view.$('input#search-site').val('t');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:view:start');
        });

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('b');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('a');
          expect(this.view.previousSearch).toEqual('b');
        });

      });

      describe("pasting a term", function () {

        it("should trigger a search:view:start", function() {
          this.view.$('input#search-site').val('pasted term');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:view:start');
        });

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('before');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('after');
          expect(this.view.previousSearch).toEqual('before');
        });

      });

      describe("deleting all terms", function() {

        it("should trigger a search:view:stop when term is empty", function() {
          this.view.$('input#search-site').val('');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:view:stop');
        });

        it("should save the previously typed term", function() {
          this.view.$('input#search-site').val('before');
          this.view.$('input#search-site').keyup();
          this.view.$('input#search-site').val('');
          expect(this.view.previousSearch).toEqual('before');
        });

      });

      describe("typing a term that is more than 3 characters", function() {

        it("should trigger a search:start event", function() {
          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          expect(this.bus).toHaveBeenCalledWith('search:view:start');
        });

        it("should trigger a search:term event after 500ms", function() {
          var clock = sinon.useFakeTimers();
          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          clock.tick(500);
          expect(this.bus).toHaveBeenCalledWith('search:view:term', {s: 'term'});
          clock.restore();
        });
      });

      describe("pressing the enter key", function() {

        it("should trigger a search:view:submit event", function() {
          var e = jQuery.Event("keyup");
          e.type = 'submit';

          this.view.$('input#search-site').val('term');
          this.view.$('input#search-site').keyup();
          this.view.$("input#search-site").trigger(e);
          expect(this.bus).toHaveBeenCalledWith('search:view:submit', {s: 'term'});
        });
      });
    });
  });
});
