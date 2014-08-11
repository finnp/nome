# NoMe - Notify Method

## TBD...

	NoMe = require 'nome'
	obj = iAmContext: yes
	obj.signal = NoMe()
	obj.method = NoMe (arg) ->
		console.log 'Method is called and has correct context: ', this.iAmContext

	obj.signal.notify ->
		console.log 'I am the signal on ', this
	, window

	obj.method.notify (arg) ->
		console.log 'I am the method and I have ', arg

	obj.signal()
	obj.method("foo")

After running this, result is like this:

	I am the signal on [window]
	Method is called and has correct context: true
	I am the method and I have foo