/* global define */

define([
  'jquery',
  'underscore',
  'backbone',
  'config/rewrite-model',
  'config/rewrite-routes'
], function ($, _, Backbone, RewriteModel, RewriteRoutes) {
  'use strict';

  var Rewrite = {
    toJSON:           RewriteModel.toJSON,
    parse:            RewriteModel.parse,
    sync:             RewriteModel.sync,

    extractParameters: RewriteRoutes.extractParameters,
    processAppRoutes:  RewriteRoutes.processAppRoutes
  };

  return Rewrite;
});