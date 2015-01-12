/* global define */

define([
  'jquery',
  'views/search-view',
  'buses/event-bus'
], function ($, SearchView, EventBus) {
  'use strict';

  describe('SearchView', function() {
    var view, trigger, formInput;

    beforeEach(function() {
      view = new SearchView();
      view.render();
      formInput = view.$('#s');
      trigger = spyOn(EventBus, 'trigger');
    });

    describe('When searching, ', function() {
      describe('starting to type any term', function () {
        it('should save the previously typed term', function() {
          formInput.val('b');
          formInput.keyup();
          formInput.val('a');
          expect(view._behaviors[0]._previousSearch).toEqual('b');
        });
      });

      describe('pasting a term', function () {
        it('should save the previously typed term', function() {
          formInput.val('before');
          formInput.keyup();
          formInput.val('after');
          expect(view._behaviors[0]._previousSearch).toEqual('before');
        });
      });

      describe('deleting all terms', function() {
        it('should trigger a search:reset when term is empty', function() {
          formInput.val('before deletion').keyup();
          formInput.val('').keyup();
          expect(trigger).toHaveBeenCalledWith('search:reset');
        });

        it('should save the previously typed term', function() {
          formInput.val('before');
          formInput.keyup();
          formInput.val('');
          expect(view._behaviors[0]._previousSearch).toEqual('before');
        });
      });

      describe('typing a term that is more than 3 characters', function() {
        it('should trigger a search:lookup event after 500ms', function() {
          var clock = sinon.useFakeTimers();
          formInput.val('term');
          formInput.keyup();
          clock.tick(500);
          expect(trigger).toHaveBeenCalledWith('search:lookup', { search: 'term' });
          clock.restore();
        });
      });

      describe('pressing the enter key', function() {
        it('should trigger a search:submit event', function() {
          var e = $.Event('keyup'),
              form = view.$('#search-site');

          e.type = 'submit';
          formInput.val('term').keyup();
          form.trigger(e);
          expect(trigger).toHaveBeenCalledWith('search:submit', { search: 'term' });
        });
      });
    });
  });
});
