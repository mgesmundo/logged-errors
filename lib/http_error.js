// Copyright 2012 Mark Cavage, Inc.  All rights reserved.

var http   = require('./http');
var util   = require('util');
var assert = require('./assert-plus');
var WError = require('verror').WError;
var outil  = require('object_utils');

///--- Globals

var slice = Function.prototype.call.bind(Array.prototype.slice);


///--- Helpers

function codeToErrorName(code) {
    code = parseInt(code, 10);
    var status = http.STATUS_CODES[code];
    if (!status)
        return (false);


    var pieces = status.split(/\s+/);
    var str = '';
    pieces.forEach(function (s) {
        str += s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    });

    str = str.replace(/\W+/g, '');
    if (!/\w+Error$/.test(str))
        str += 'Error';

    return (str);
}

function stackToArray(stack) {
    if (stack && stack.split) {
        return stack.split('\n').map(Function.prototype.call, String.prototype.trim);
    }
    return stack;
}

///--- Error Base class

function HttpError(options) {
    assert.object(options, 'options');

    this.withStack = function withStack(asArray) {
        this.body = this.body || {};
        if (asArray) {
            this.body.stack = stackToArray(this.stack);
        } else {
            this.body.stack = this.stack;
        }
        return this;
    };

    this.toArray = function toArray() {
        if (this.body.stack) {
          this.body.stack = stackToArray(this.body.stack);
        }
        return this;
    };

    this.log = function log() {
        if (config.logger && config.logger.error) {
            var msg = this.message;
            if ('function' === typeof config.formatter) {
                msg = config.formatter(this);
            }
            config.logger.error(msg);
        }
        return this;
    };

  options.constructorOpt = options.constructorOpt || HttpError;
    WError.apply(this, arguments);

    var self = this;
    var code = parseInt((options.statusCode || 500), 10);
    this.statusCode = code;
    this.body = options.body || {
        code: codeToErrorName(code),
        message: options.message || self.message
    };
    this.message = options.message || self.message;
}

util.inherits(HttpError, WError);


///--- Exports

module.exports = {

    HttpError: HttpError,

    codeToHttpError: function codeToHttpError(code, message, body) {
        var err;
        var name = codeToErrorName(code);

        if (!name) {
            err = new HttpError({
                statusCode: code,
                message: message,
                body: body
            });
            err.name = 'Http' + code + 'Error';
        } else {
            err = new module.exports[name]({
                body: body,
                message: message,
                constructorOpt: codeToHttpError,
                statusCode: code
            });
        }

        return (err);
    }
};


// Export all the 4xx and 5xx HTTP Status codes as Errors
var codes = Object.keys(http.STATUS_CODES);

codes.forEach(function (code) {
    var name = codeToErrorName(code);

    module.exports[name] = function (cause, message) {
        var index = 1;
        var opts = {
            statusCode: code
        };

        if (cause && cause instanceof Error) {
            opts.cause = cause;
            opts.constructorOpt = arguments.callee;
        } else if (typeof (cause) === 'object') {
            opts.body = cause.body;
            opts.cause = cause.cause;
            opts.constructorOpt = cause.constructorOpt;
            opts.message = cause.message;
            opts.statusCode = cause.statusCode || code;
        } else {
            opts.constructorOpt = arguments.callee;
            index = 0;
        }

        var args = slice(arguments, index);
        args.unshift(opts);
        HttpError.apply(this, args);
    };
    util.inherits(module.exports[name], HttpError);

    module.exports[name].displayName =
        module.exports[name].prototype.name =
            name;
});

var config = {
  logger: console,
  formatter: function(error) {
      // you can define your formatter
      return error.body
  }
};

module.exports.setConfig = function(newConfig) {
    config = outil.merge(config, newConfig);
};
module.exports.getConfig = function() {
    return config;
}