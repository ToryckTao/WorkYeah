var core = require('./core/index.js')
var entities = require('./entities/index.js')

module.exports = {
  Result: core.Result,
  Entity: core.Entity,
  AggregateRoot: core.AggregateRoot,
  DomainEvent: core.DomainEvent,
  UniqueEntityId: core.UniqueEntityId,
  Guard: core.Guard,
  User: entities.User,
  Project: entities.Project
}

