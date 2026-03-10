function Result(isSuccess, error, value) {
  this.isSuccess = isSuccess
  this.isFailure = !isSuccess
  this.error = error
  this._value = value
  Object.freeze(this)
}

Result.prototype.getValue = function() {
  if (this.isFailure) {
    throw new Error('Cannot get value from failed result')
  }
  return this._value
}

Result.prototype.getErrorValue = function() {
  return this.error
}

Result.ok = function(value) {
  return new Result(true, undefined, value)
}

Result.fail = function(error) {
  return new Result(false, error)
}

Result.combine = function(results) {
  for (var i = 0; i < results.length; i++) {
    if (results[i].isFailure) return results[i]
  }
  return Result.ok()
}

module.exports = {
  Result: Result
}

