var UniqueEntityId = require('./UniqueEntityId.js').UniqueEntityId

function Entity(props, id) {
  this._id = id || UniqueEntityId.create()
  this.props = props
}

Entity.prototype.getId = function() {
  return this._id
}

Entity.prototype.equals = function(entity) {
  if (entity === null || entity === undefined) {
    return false
  }
  if (this === entity) {
    return true
  }
  return this._id.equals(entity._id)
}

function AggregateRoot(props, id) {
  Entity.call(this, props, id)
  this._domainEvents = []
}

AggregateRoot.prototype = Object.create(Entity.prototype)
AggregateRoot.prototype.constructor = AggregateRoot

AggregateRoot.prototype.getDomainEvents = function() {
  return this._domainEvents
}

AggregateRoot.prototype.addDomainEvent = function(domainEvent) {
  this._domainEvents.push(domainEvent)
}

AggregateRoot.prototype.clearEvents = function() {
  this._domainEvents = []
}

function DomainEvent(aggregateId) {
  this.occurredOn = new Date()
  this.aggregateId = aggregateId
}

DomainEvent.prototype.getAggregateId = function() {
  return this.aggregateId
}

module.exports = {
  Entity: Entity,
  AggregateRoot: AggregateRoot,
  DomainEvent: DomainEvent
}

