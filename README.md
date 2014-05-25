# logged-errors

This module is a simple fork of the [restify-errors][1] with some chainable features:

- it can log the error using an external logger (e.g. [winston][2])
- it can show the error stack in the body of the error
- it can format the log output
- it works both in Node and browser

## Installation

Install `logged-errors` as usual:

    $ npm install --save logged-errors

For browser environment add `logged-error.js` file in build folder.

## Example

    // see the examples folder

    // dependencies
    var LoggedErrors = require('logged-errors');

    // add the stack to the body of the error
    throw new LoggedErrors.NotFoundError('some error').withStack().log();

    // the following statements are equivalent
    throw new LoggedErrors.NotFoundError('some error').withStack().toArray().log();
    throw new LoggedErrors.NotFoundError('some error').withStack(true).log();

    // set a new formatter and your logger (default is console)
    LoggedErrors.set({
        formatter: function (e) {
            return 'error occurred: ' + e.message;
        }
    });


For other information please refer to [restify][3] documentation.

[1]: https://www.npmjs.org/package/restify-errors
[2]: https://www.npmjs.org/package/winston
[3]: https://www.npmjs.org/package/restify