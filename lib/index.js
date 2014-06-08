// Copyright 2012 Mark Cavage, Inc.  All rights reserved.

var httpErrors = require('./http_error');
var restErrors = require('./rest_error');

module.exports = {
  'set': function(config) {
    httpErrors.setConfig(config);
  },
  codeToErrorName: httpErrors.codeToErrorName
};

Object.keys(httpErrors).forEach(function (k) {
    module.exports[k] = httpErrors[k];
});

// Note some of the RestErrors overwrite plain HTTP errors.
Object.keys(restErrors).forEach(function (k) {
    module.exports[k] = restErrors[k];
});
