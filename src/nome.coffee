'use strict'

Lill = require 'lill'
fast = require 'fast.js'
isFunction = require 'isfunction'

NoMe = (fn) ->
	fn = isFunction(fn) and fn
	nome = ->
		self = this
		args = arguments

		result = fn and fast.apply fn, this, args

		Lill.each nome, NoMe$loop = ({cb, ctx}) ->
			fast.apply cb, (ctx or self), args
			return

		return result

	nome.notify = NoMe$notify
	nome.denotify = NoMe$denotify

	Lill.attach nome

	return Object.freeze nome

NoMe$notify = (cb, ctx) ->
	unless isFunction cb
		throw new TypeError 'expected function for notification'
	Lill.add this, item = {cb, ctx}
	return item

NoMe$denotify = (item) ->
	Lill.remove this, item
	return

NoMe.is = (value) ->
	return Boolean(isFunction(value) and value.notify is NoMe$notify)

module.exports = Object.freeze NoMe