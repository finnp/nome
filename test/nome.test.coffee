chai = chai or require 'chai'
expect = chai.expect
sinon = require 'sinon'
chai.use require 'sinon-chai'

NoMe = require '../src/nome'

describe 'NoMe', ->

  it 'should be a function', ->
    expect(NoMe).to.be.an "function"

  it 'should return a function when invoked', ->
    expect(NoMe()).to.be.an "function"

  it 'notify() expects function in first argument', ->
    wrapped = NoMe()
    toThrow = (msg, fn) ->
      expect(fn).to.throw TypeError, /expected function/, msg
    toThrow 'number', -> wrapped.notify 1
    toThrow 'bool', -> wrapped.notify false
    toThrow 'string', -> wrapped.notify 'nothing'
    toThrow 'array', -> wrapped.notify []
    toThrow 'object', -> wrapped.notify {}

    expect(wrapped.notify new Function).to.not.throw

  describe 'returned function', ->

    it 'responds to notify method', ->
      actual = NoMe()
      expect(actual).itself.to.respondTo 'notify'

    it 'responds to denotify method', ->
      actual = NoMe()
      expect(actual).itself.to.respondTo 'denotify'

  describe 'invokes wrapped function', ->

    beforeEach ->
      @nome = NoMe @spy = sinon.spy()

    it 'when returned function is invoked', ->
      @nome()
      expect(@spy).to.have.been.calledOnce

    it 'with identical arguments', ->
      @nome(arg1 = "foo", arg2 = false, arg3 = 10)
      expect(@spy).to.have.been.calledWith(arg1, arg2, arg3)

    it 'with correct context', ->
      ctx = nome: @nome
      ctx.nome(arg = "foo")
      expect(@spy).to.have.been.calledOnce.calledOn(ctx).calledWith(arg)

    it 'before any function added with notify()', ->
      @nome.notify spy = sinon.spy()
      @nome()
      expect(@spy).to.have.been.calledBefore spy

  describe 'invokes function added by notify()', ->

    beforeEach ->
      @nome = NoMe()
      @id = @nome.notify @spy = sinon.spy()

    it 'when returned function is invoked', ->
      @nome()
      expect(@spy).to.have.been.calledOnce

    it 'with identical arguments', ->
      @nome(arg1 = "foo", arg2 = false, arg3 = 10)
      expect(@spy).to.have.been.calledWith(arg1, arg2, arg3)

    it 'with correct context', ->
      ctx = nome: @nome
      ctx.nome(arg = "foo")
      expect(@spy).to.have.been.calledOnce.calledOn(ctx).calledWith(arg)

    it 'stops invoking when removed with denotify()', ->
      @nome.denotify @id
      @nome()
      expect(@spy).to.not.have.been.called

  it 'invokes all functions in order of notify() call', ->
    @nome = NoMe()
    @nome.notify spy1 = sinon.spy()
    @nome.notify spy2 = sinon.spy()
    @nome.notify spy3 = sinon.spy()
    @nome()
    expect(spy1).to.have.been.calledBefore spy2
    expect(spy3).to.have.been.calledAfter spy2

  it 'responds to `is` static method', ->
    expect(NoMe).itself.to.respondTo 'is'

  describe 'is()', ->

    it 'returns true for function wrapped by NoMe', ->
      expect(NoMe.is NoMe()).to.be.true

    it 'returns false for standard function', ->
      actual = new Function
      expect(NoMe.is actual).to.be.false
      actual.notify = ->
      actual.denotify = ->
      expect(NoMe.is actual).to.be.false

