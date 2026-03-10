var core = require('../core/index.js')
var AggregateRoot = core.AggregateRoot
var DomainEvent = core.DomainEvent
var UniqueEntityId = core.UniqueEntityId
var Result = core.Result
var Guard = core.Guard

function UserCreatedEvent(user) {
  DomainEvent.call(this, user.getId())
  this.eventName = 'user.created'
  this.user = user
}
UserCreatedEvent.prototype = Object.create(DomainEvent.prototype)

function User(props, id) {
  AggregateRoot.call(this, props, id)
}

User.prototype = Object.create(AggregateRoot.prototype)
User.prototype.constructor = User

Object.defineProperty(User.prototype, 'email', {
  get: function() { return this.props.email }
})

Object.defineProperty(User.prototype, 'name', {
  get: function() { return this.props.name }
})

Object.defineProperty(User.prototype, 'username', {
  get: function() { return this.props.username }
})

Object.defineProperty(User.prototype, 'avatar', {
  get: function() { return this.props.avatar }
})

Object.defineProperty(User.prototype, 'role', {
  get: function() { return this.props.role }
})

Object.defineProperty(User.prototype, 'status', {
  get: function() { return this.props.status }
})

Object.defineProperty(User.prototype, 'subscription', {
  get: function() { return this.props.subscription }
})

User.create = function(props, id) {
  var guardResult = Guard.combine([
    Guard.againstNullOrUndefined(props.email, 'email'),
    Guard.againstNullOrUndefined(props.name, 'name'),
    Guard.againstNullOrUndefined(props.username, 'username')
  ])

  if (!guardResult.succeeded) {
    return Result.fail(guardResult.message)
  }

  var user = new User({
    email: props.email,
    name: props.name,
    username: props.username,
    phone: props.phone,
    avatar: props.avatar,
    role: props.role || 'USER',
    status: props.status || 'ACTIVE',
    subscription: props.subscription || 'FREE',
    createdAt: props.createdAt || new Date()
  }, id)

  if (!id) {
    user.addDomainEvent(new UserCreatedEvent(user))
  }

  return Result.ok(user)
}

User.reconstitute = function(data) {
  return Result.ok(new User({
    email: data.email,
    name: data.name,
    username: data.username,
    phone: data.phone,
    avatar: data.avatar,
    role: data.role,
    status: data.status,
    subscription: data.subscription,
    createdAt: new Date(data.createdAt)
  }, UniqueEntityId.create(data.id)))
}

User.prototype.isActive = function() {
  return this.status === 'ACTIVE'
}

User.prototype.isAdmin = function() {
  return this.role === 'ADMIN'
}

User.prototype.isPremium = function() {
  return this.subscription !== 'FREE'
}

module.exports = {
  User: User,
  UserCreatedEvent: UserCreatedEvent
}

