var errors = loggedErrors;

new errors.BadDigestError('some error').log();
new errors.NoContentError('some error with %s', 'no content').log('msg');
new errors.NotFoundError('some error').withStack().log();
new errors.ForbiddenError('some error').withStack().toArray().log();
errors.set({
  format: function(e) {
    return 'error occurred: ' + e.body.code + ' due ' + e.message;
  }
});
new errors.PreconditionFailedError('missing parameter').withStack().toArray().log();
new errors[errors.codeToErrorName(404)]('404 error').log();