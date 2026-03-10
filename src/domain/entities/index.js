var User = require('./User.js').User
var UserCreatedEvent = require('./User.js').UserCreatedEvent
var Project = require('./Project.js').Project
var ProjectCreatedEvent = require('./Project.js').ProjectCreatedEvent

module.exports = {
  User: User,
  UserCreatedEvent: UserCreatedEvent,
  Project: Project,
  ProjectCreatedEvent: ProjectCreatedEvent
}

