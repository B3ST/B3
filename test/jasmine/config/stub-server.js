/* global define, sinon */

define([
  'sinon'
], function () {
  'use strict';

  function stubServer (options) {
    var server = sinon.fakeServer.create();
    server.respondWith(
      'GET',
      options.url,
      [options.code, {'Content-Type': 'application/json'}, JSON.stringify(options.response)]
    );

    return server;
  }

  window.stubServer = stubServer;
  return stubServer;
});