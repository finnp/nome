# NoMe - Notify Method

Have you ever wanted to be notified when some function is invoked? NoMe is at your service.

[![Build Status](https://travis-ci.org/BlackDice/nome.svg)](https://travis-ci.org/BlackDice/nome)[![Dependencies status](https://david-dm.org/BlackDice/nome/status.svg)](https://david-dm.org/BlackDice/nome#info=dependencies)[![devDependency Status](https://david-dm.org/BlackDice/nome/dev-status.svg)](https://david-dm.org/BlackDice/nome#info=devDependencies)

[![NPM](https://nodei.co/npm/nome.png)](https://nodei.co/npm/nome/)

## Installation

To install for use in NodeJS, simply run

	npm install -S nome

There is also Bower package available for use in browser.

	bower install -S nome

The `lib` folder contains various files:

 * nome.js - plain JS compiled from source coffee file
 * nome.min.js - same as above just minified
 * nome-browser.js - browserified bundle packed with dependencies
 * nome-browser.min.js - minified version of the above file

## Basic usage

Once you have function wrapped by NoMe, you can get notified about its invocation like this.

	wrapped.notify (arg) ->
		console.log 'wrapped just got called with:', arg

	wrapped 'foo'

You can call `notify` method as many times as you want. These will be executed in order they were added. Arguments passed upon invocation and used context is also preserved.

How to actually create the wrapped function? There are two easy ways.

#### Wrapped function

For most of the time you would probably want to wrap existing function or method.

	wrapped = NoMe ->
		console.log 'actual function has been called'

**Important**: Wrapped function is called first and then followed by signed up notification functions.

#### Simple signal

If you don't want any actual body for a function, NoMe can be used like this:

	wrapped = NoMe()

### Specify context

Some of your notifiers might require different context (*this*) than the one used for invocation. You can specify this easily.

	wrapped.notify someHandler, ctx

It will be remembered and every time when this particular notifier is invoked, the specified context will be used.

### Stop notifying

Sometimes you might want to remove your handler and stop being notified about further invocations. It can be done like this.

	nomeNotifier = wrapped.notify someHandler
	# sometimes later ...
	wrapped.denotify nomeNotifier

Essentially it means you have keep around value returned from `notify` call and use that to sign-off the notifier.

### Check for wrapper

In case you want easily check if the function is actually wrapped by NoMe (eg. for tests), there is small function returning boolean.

	NoMe.is wrapped

### Example

	obj = iAmContext: yes

	obj.signal = NoMe()
	obj.signal.notify ->
		console.log 'I am the signal always executed in window context'
	, window

	obj.method = NoMe (arg) ->
		console.log 'Method is called and with context of obj'
	obj.method.notify (arg) ->
		console.log 'I am the notifier and I have ', arg

	obj.signal()
	obj.method("foo")

After running this, result is like this:

	I am the signal always executed in window context
	Method is called and with context of obj
	I am the notifier and I have foo

## Tests

NoMe is fully tested. You can check out the result of the tests at [Travis CI](https://travis-ci.org/BlackDice/nome) or clone repository for yourself, run `npm install` first and then `npm test`.
