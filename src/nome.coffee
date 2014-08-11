Lill = require 'lill'
fast = require 'fast.js'
isFunction = require 'isfunction'

Symbol = require 'es6-symbol'
bNotify = Symbol 'method used to attach notification function'
bDenotify = Symbol 'method used to detach previously attached function'

NoMe = (method) ->
	method = isFunction(method) and method
	nome = ->
		self = this
		args = arguments
		method and fast.apply method, this, args
		Lill.each nome, ({cb, ctx}) -> fast.apply cb, (ctx or self), args
	
	Lill.attach nome
	
	nome[ bNotify ] = (cb, ctx) ->
		unless isFunction cb
			throw new TypeError 'expected function for notification'
		Lill.add nome, item = {cb, ctx}
		return item
	
	nome[ bDenotify ] = (item) ->
		Lill.remove nome, item
		return 
	
	return Object.freeze nome

NoMe.is = (value) ->
	return !!(isFunction(value) and value[ bNotify ] and value[ bDenotify ])

NoMe.bNotify = bNotify
NoMe.bDenotify = bDenotify

module.exports = Object.freeze NoMe