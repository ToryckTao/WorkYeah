var core = require('../core/index.js')
var AggregateRoot = core.AggregateRoot
var DomainEvent = core.DomainEvent
var UniqueEntityId = core.UniqueEntityId
var Result = core.Result
var Guard = core.Guard

function ProjectCreatedEvent(project) {
  DomainEvent.call(this, project.getId())
  this.eventName = 'project.created'
  this.project = project
}
ProjectCreatedEvent.prototype = Object.create(DomainEvent.prototype)

function Project(props, id) {
  AggregateRoot.call(this, props, id)
}

Project.prototype = Object.create(AggregateRoot.prototype)
Project.prototype.constructor = Project

Object.defineProperty(Project.prototype, 'name', {
  get: function() { return this.props.name }
})

Object.defineProperty(Project.prototype, 'description', {
  get: function() { return this.props.description }
})

Object.defineProperty(Project.prototype, 'type', {
  get: function() { return this.props.type }
})

Object.defineProperty(Project.prototype, 'status', {
  get: function() { return this.props.status }
})

Object.defineProperty(Project.prototype, 'ownerId', {
  get: function() { return this.props.ownerId }
})

Object.defineProperty(Project.prototype, 'members', {
  get: function() { return this.props.members }
})

Project.create = function(props, id) {
  var guardResult = Guard.combine([
    Guard.againstNullOrUndefined(props.name, 'name'),
    Guard.againstNullOrUndefined(props.ownerId, 'ownerId'),
    Guard.isOneOf(props.type, ['IT_DEVELOPMENT', 'HUMANITIES_REPORT', 'BUSINESS_ANALYSIS', 'OTHER'], 'type')
  ])

  if (!guardResult.succeeded) {
    return Result.fail(guardResult.message)
  }

  var project = new Project({
    name: props.name,
    description: props.description,
    type: props.type,
    status: 'IN_PROGRESS',
    ownerId: props.ownerId,
    teamId: props.teamId,
    members: [{
      userId: props.ownerId,
      role: 'LEADER',
      joinedAt: new Date()
    }],
    createdAt: new Date(),
    lastModified: new Date()
  }, id)

  if (!id) {
    project.addDomainEvent(new ProjectCreatedEvent(project))
  }

  return Result.ok(project)
}

Project.reconstitute = function(data) {
  return Result.ok(new Project({
    name: data.name,
    description: data.description,
    type: data.type,
    status: data.status,
    ownerId: data.ownerId,
    teamId: data.teamId,
    members: data.members.map(function(m) {
      return {
        userId: m.userId,
        role: m.role,
        joinedAt: new Date(m.joinedAt)
      }
    }),
    createdAt: new Date(data.createdAt),
    lastModified: new Date(data.lastModified)
  }, UniqueEntityId.create(data.id)))
}

Project.prototype.hasMember = function(userId) {
  return this.props.members.some(function(m) {
    return m.userId === userId
  })
}

Project.prototype.isOwner = function(userId) {
  return this.ownerId === userId
}

Project.prototype.getMemberCount = function() {
  return this.props.members.length
}

Project.prototype.addMember = function(userId, role) {
  var self = this
  if (this.hasMember(userId)) {
    return Result.fail('该用户已是项目成员')
  }

  this.props.members.push({
    userId: userId,
    role: role || 'MEMBER',
    joinedAt: new Date()
  })
  this.props.lastModified = new Date()

  return Result.ok()
}

module.exports = {
  Project: Project,
  ProjectCreatedEvent: ProjectCreatedEvent
}

