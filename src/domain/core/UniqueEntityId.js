function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function UniqueEntityId(id) {
  this.value = id || generateUUID()
}

UniqueEntityId.create = function(id) {
  return new UniqueEntityId(id)
}

UniqueEntityId.prototype.getValue = function() {
  return this.value
}

UniqueEntityId.prototype.equals = function(id) {
  if (id === null || id === undefined) {
    return false
  }
  return this.value === id.getValue()
}

UniqueEntityId.prototype.toString = function() {
  return this.value
}

module.exports = {
  UniqueEntityId: UniqueEntityId
}

