/* global define */

define([
  'jquery',
  'backbone',
  'models/revision-model'
], function ($, Backbone, Revision) {
  'use strict';
  var Revisions = Backbone.Collection.extend({
    model: Revision,
    comparator: function (revision) {
      return [revision.get('parent'), revision.get('ID')];
    }
  });

  return Revisions;
});
