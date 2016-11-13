import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import NoMe from '../dist/nome'

chai.use(sinonChai)

describe('NoMe', function () {
	it('should be a function', function () {
		expect(NoMe).to.be.an('function')
	})
	it('should return a function when invoked', function () {
		expect(NoMe()).to.be.an('function')
	})
	it('notify() expects function in first argument', function () {
		const wrapped = NoMe()
		function toThrow(msg, fn) {
			expect(fn).to.throw(TypeError, /expects function/, msg)
		}
		toThrow('number', function () {
			wrapped.notify(1)
		})
		toThrow('bool', function () {
			wrapped.notify(false)
		})
		toThrow('string', function () {
			wrapped.notify('nothing')
		})
		toThrow('array', function () {
			wrapped.notify([])
		})
		toThrow('object', function () {
			wrapped.notify({})
		})
		expect(wrapped.notify(() => {})).to.not.throw
	})
	describe('returned function', function () {
		it('responds to notify method', function () {
			const actual = NoMe()
			expect(actual).itself.to.respondTo('notify')
		})
		it('responds to denotify method', function () {
			const actual = NoMe()
			expect(actual).itself.to.respondTo('denotify')
		})
	})
	describe('invokes wrapped function', function () {
		beforeEach(function () {
			this.nome = NoMe(this.spy = sinon.spy())
		})
		it('when returned function is invoked', function () {
			this.nome()
			expect(this.spy).to.have.been.calledOnce
		})
		it('with identical arguments', function () {
			const arg1 = 'foo'
			const arg2 = false
			const arg3 = 10
			this.nome(arg1, arg2, arg3)
			expect(this.spy).to.have.been.calledWith(arg1, arg2, arg3)
		})
		it('with correct context', function () {
			const ctx = {
				nome: this.nome,
			}
			const arg = 'foo'
			ctx.nome(arg)
			expect(this.spy).to.have.been.calledOnce.calledOn(ctx).calledWith(arg)
		})
		it('before any function added with notify()', function () {
			const spy = sinon.spy()
			this.nome.notify(spy)
			this.nome()
			expect(this.spy).to.have.been.calledBefore(spy)
		})
	})
	describe('invokes function added by notify()', function () {
		beforeEach(function () {
			this.nome = NoMe()
			this.id = this.nome.notify(this.spy = sinon.spy())
		})
		it('when returned function is invoked', function () {
			this.nome()
			expect(this.spy).to.have.been.calledOnce
		})
		it('with identical arguments', function () {
			const arg1 = 'foo'
			const arg2 = false
			const arg3 = 10
			this.nome(arg1, arg2, arg3)
			expect(this.spy).to.have.been.calledWith(arg1, arg2, arg3)
		})
		it('with context of source object', function () {
			const ctx = {
				nome: this.nome,
			}
			const arg = 'foo'
			ctx.nome(arg)
			expect(this.spy).to.have.been.calledOnce.calledOn(ctx).calledWith(arg)
		})
		it('with specified context', function () {
			const ctx = {}
			const arg = 'foo'
			const spy = sinon.spy()
			this.nome.notify(spy, ctx)
			this.nome(arg)
			expect(spy).to.have.been.calledOnce.calledOn(ctx).calledWith(arg)
		})
		it('stops invoking when removed with denotify()', function () {
			this.nome.denotify(this.id)
			this.nome()
			expect(this.spy).to.not.have.been.called
		})
	})
	it('invokes all functions in order of notify() call', function () {
		const spy1 = sinon.spy()
		const spy2 = sinon.spy()
		const spy3 = sinon.spy()
		this.nome = NoMe()
		this.nome.notify(spy1)
		this.nome.notify(spy2)
		this.nome.notify(spy3)
		this.nome()
		expect(spy1).to.have.been.calledBefore(spy2)
		expect(spy3).to.have.been.calledAfter(spy2)
	})
	it('responds to `is` static method', function () {
		expect(NoMe).itself.to.respondTo('is')
	})
	describe('is()', function () {
		it('returns true for function wrapped by NoMe', function () {
			expect(NoMe.is(NoMe())).to.be.true
		})
		it('returns false for standard function', function () {
			const actual = () => {}
			expect(NoMe.is(actual)).to.be.false
			actual.notify = function () {}
			actual.denotify = function () {}
			expect(NoMe.is(actual)).to.be.false
		})
	})
})
