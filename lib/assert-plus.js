function _assert(arg, type, name, stackFunc) {
  name = name || type;
  stackFunc = stackFunc || _assert.caller;
  var t = typeof (arg);

  if (t !== type) {
    throw new assert.AssertionError({
      message: _(TYPE_REQUIRED, name, type),
      actual: t,
      expected: type,
      operator: '===',
      stackStartFunction: stackFunc
    });
  }
}

function object(arg, name) {
  _assert(arg, 'object', name);
}

exports.object = object;