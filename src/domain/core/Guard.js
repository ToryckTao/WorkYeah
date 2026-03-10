var Guard = {}

Guard.combine = function(guardResults) {
  for (var i = 0; i < guardResults.length; i++) {
    if (!guardResults[i].succeeded) return guardResults[i]
  }
  return { succeeded: true }
}

Guard.againstNullOrUndefined = function(argument, argumentName) {
  if (argument === null || argument === undefined) {
    return { succeeded: false, message: argumentName + ' 不能为空' }
  }
  return { succeeded: true }
}

Guard.isOneOf = function(value, validValues, argumentName) {
  if (validValues.indexOf(value) === -1) {
    return {
      succeeded: false,
      message: argumentName + ' 必须是 [' + validValues.join(', ') + '] 中的一个'
    }
  }
  return { succeeded: true }
}

Guard.inRange = function(num, min, max, argumentName) {
  if (num < min || num > max) {
    return { succeeded: false, message: argumentName + ' 必须在 ' + min + ' 和 ' + max + ' 之间' }
  }
  return { succeeded: true }
}

Guard.againstAtLeast = function(numChars, text, argumentName) {
  if (text.length < numChars) {
    return { succeeded: false, message: argumentName + ' 长度至少为 ' + numChars + ' 个字符' }
  }
  return { succeeded: true }
}

Guard.isValidEmail = function(email, argumentName) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { succeeded: false, message: argumentName + ' 格式不正确' }
  }
  return { succeeded: true }
}

module.exports = {
  Guard: Guard
}

