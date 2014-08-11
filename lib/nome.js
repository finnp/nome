/*
* The MIT License (MIT)
* Copyright © 2014 Daniel K. (FredyC)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var Lill, NoMe, Symbol, bDenotify, bNotify, fast, isFunction;

Lill = require('lill');

fast = require('fast.js');

isFunction = require('isfunction');

Symbol = require('es6-symbol');

bNotify = Symbol('method used to attach notification function');

bDenotify = Symbol('method used to detach previously attached function');

NoMe = function(method) {
  var nome;
  method = isFunction(method) && method;
  nome = function() {
    var args, self;
    self = this;
    args = arguments;
    method && fast.apply(method, this, args);
    return Lill.each(nome, function(_arg) {
      var cb, ctx;
      cb = _arg.cb, ctx = _arg.ctx;
      return fast.apply(cb, ctx || self, args);
    });
  };
  Lill.attach(nome);
  nome[bNotify] = function(cb, ctx) {
    var item;
    if (!isFunction(cb)) {
      throw new TypeError('expected function for notification');
    }
    Lill.add(nome, item = {
      cb: cb,
      ctx: ctx
    });
    return item;
  };
  nome[bDenotify] = function(item) {
    Lill.remove(nome, item);
  };
  return Object.freeze(nome);
};

NoMe.is = function(value) {
  return !!(isFunction(value) && value[bNotify] && value[bDenotify]);
};

NoMe.bNotify = bNotify;

NoMe.bDenotify = bDenotify;

module.exports = Object.freeze(NoMe);
