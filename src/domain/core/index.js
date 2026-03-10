var Result = require('./Result.js').Result
var Entity = require('./Entity.js').Entity
var AggregateRoot = require('./Entity.js').AggregateRoot
var DomainEvent = require('./Entity.js').DomainEvent
var UniqueEntityId = require('./UniqueEntityId.js').UniqueEntityId
var Guard = require('./Guard.js').Guard

module.exports = {
  Result: Result,
  Entity: Entity,
  AggregateRoot: AggregateRoot,
  DomainEvent: DomainEvent,
  UniqueEntityId: UniqueEntityId,
  Guard: Guard
}

