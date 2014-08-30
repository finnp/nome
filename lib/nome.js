/*
* The MIT License (MIT)
* Copyright © 2014 Daniel K. (FredyC)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* 
* Version: 0.1.1
*/
'use strict';
var Lill, NoMe, NoMe$denotify, NoMe$notify, fast, isFunction;

Lill = require('lill');

fast = require('fast.js');

isFunction = require('isfunction');

NoMe = function(fn) {
  var nome;
  fn = isFunction(fn) && fn;
  nome = function() {
    var NoMe$loop, args, result, self;
    self = this;
    args = arguments;
    result = fn && fast.apply(fn, this, args);
    Lill.each(nome, NoMe$loop = function(_arg) {
      var cb, ctx;
      cb = _arg.cb, ctx = _arg.ctx;
      fast.apply(cb, ctx || self, args);
    });
    return result;
  };
  nome.notify = NoMe$notify;
  nome.denotify = NoMe$denotify;
  Lill.attach(nome);
  return Object.freeze(nome);
};

NoMe$notify = function(cb, ctx) {
  var item;
  if (!isFunction(cb)) {
    throw new TypeError('expected function for notification');
  }
  Lill.add(this, item = {
    cb: cb,
    ctx: ctx
  });
  return item;
};

NoMe$denotify = function(item) {
  Lill.remove(this, item);
};

NoMe.is = function(value) {
  return Boolean(isFunction(value) && value.notify === NoMe$notify);
};

module.exports = Object.freeze(NoMe);
