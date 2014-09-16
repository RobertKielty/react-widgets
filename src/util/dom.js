
var _ = require('lodash')
  , transitionTiming, transitionDuration
  , transitionProperty, transitionDelay
  , notSupported, endEvent
  , prefix = ''
  , el = document.createElement('div')
  , reset = {}
  , transitions = {
      O:'otransitionend', 
      Moz:'transitionend',
      Webkit:'webkitTransitionEnd'
    };

function maybeLib(method, fn){
  return function(node){
    var $ = window.jQuery || window.Zepto

    if( $ ) {
      node = $(node)
      return node[method].apply(node, _.rest(arguments))
    }
    else return fn.apply(arguments)
  }
}

_.any(transitions, function(event, vendor){
  if (el.style[vendor + 'TransitionProperty'] !== undefined) {
    prefix = '-' + vendor.toLowerCase() + '-'
    endEvent = event;
    return true
  }
})

if (!endEvent && el.style.transitionProperty !== undefined)
  endEvent = 'transitionend'

notSupported = !endEvent

reset[transitionProperty = prefix + 'transition-property'] =
reset[transitionDuration = prefix + 'transition-duration'] =
reset[transitionDelay    = prefix + 'transition-delay'] =
reset[transitionTiming   = prefix + 'transition-timing-function'] = ''


var DOM = module.exports = {

  width: function(node){
    return DOM.offset(node).width
  },

  height: function(node){
    return DOM.offset(node).height
  },

  hasFocus: function(node){
    var doc = node.ownerDocument

    if ( doc.activeElement == null) return false
    return doc.activeElement === node 
  },

  offset: function (node) {
    var doc     = node.ownerDocument
      , docElem = doc && doc.documentElement
      , box     = { top: 0, left: 0 };

    if ( !docElem ) return

    if ( !DOM.contains(docElem, node))
      return box

    if ( node.getBoundingClientRect !== undefined ) 
      box = node.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft,
      width: box.width || node.offsetWidth,
      height: box.height || node.offsetHeight,
    };
  },

  css: function(node, property, value){
      var css = ''
        , properties = property;

      if ( typeof property === 'string') {
        if ( value === undefined)
          return node.style[camelize(property)] || getComputedStyle(node).getPropertyValue(property)
        else 
          (properties = {})[property] = value
      }
        
      _.each(properties, function(val, key){
        !val && val !== 0
          ? node.style.removeProperty(dasherize(key))
          : (css += dasherize(key) + ':' + val + ';')
      })

      node.style.cssText += ';' + css
  },

  contains: (function(){
    var root = document.documentElement

    return (root && root.contains) 
      ? function(context, node){ return context.contains(node); } 
      : (root && root.compareDocumentPosition) 
          ? function(context, node){
            return context === node || !!(context.compareDocumentPosition(node) & 16);
          } 
          : function(context, node){
            if (node) do {
              if (node === context) return true;
            } while ((node = node.parentNode));
            
            return false;
          }
  })(),

  /* jQuery UI | https://github.com/jquery/jquery-ui/blob/bbf9ea0942622a40d1adafeaed7045e0cf6ff8fd/ui/core.js#L51 */
  scrollParent: function(node) {
    var position = DOM.css(node, "position" )
      , excludeStaticParent = position === "absolute"
      , overflowRegex = /(auto|scroll)/
      , root = node.ownerDocument || document
      , scrollParent;

    if ( position === "fixed" ) 
      return root

    scrollParent = _.find(parents(node), function(parent) {

      if ( excludeStaticParent && DOM.css(parent, "position" ) === "static" )
        return false;
      
      return overflowRegex.test( 
          DOM.css(parent, "overflow") 
        + DOM.css(parent, "overflow-y") 
        + DOM.css(parent, "overflow-x"))
    });

    return scrollParent || root
  },

  on: function(node, eventName, handler){
    if (node.addEventListener) 
      node.addEventListener(eventName, handler, false);
    
    else if (node.attachEvent) 
      node.attachEvent('on' + eventName, handler);
    
    else 
      node['on' + eventName] = handler;
  },

  off: function(node, eventName, handler){
    if (node.addEventListener) 
      node.removeEventListener(eventName, handler, false);   
    else if (node.attachEvent) 
      node.detachEvent('on' + eventName, handler); 
    else 
      node['on' + eventName] = null;
  },

  trigger: function(node, type){
    var event = document.createEvent('Events')
    event.initEvent(type, true, true)
    node.dispatchEvent(event);
  },

  /* code in part from: Zepto 1.1.4 | zeptojs.com/license */
  // super lean animate function for transitions
  // doesn't support translations to keep it matching the jquery API
  animate: function(node, properties, duration, easing, callback){
    var cssProperties = []
      , fakeEvent = { target: node, currentTarget: node }
      , cssValues = {}
      , fired;

    if ( typeof easing === 'function' ) 
      callback = easing, easing = null

    if ( notSupported )           duration = 0
    if ( duration === undefined ) duration = 200
          
    for (key in properties) {
      cssValues[key] = properties[key]
      cssProperties.push(dasherize(key))
    }

    if (duration > 0 ) {
      cssValues[transitionProperty] = cssProperties.join(', ')
      cssValues[transitionDuration] = (duration / 1000) + 's'
      cssValues[transitionDelay]    = 0 + 's'
      cssValues[transitionTiming]   = easing || 'linear'

      DOM.on(node, endEvent, done)

      setTimeout(function(){
        if (!fired) done(fakeEvent) 
      }, duration + 25)
    }

    // trigger page reflow 
    node.clientLeft

    DOM.css(node, cssValues)

    if (duration <= 0) 
      setTimeout(_.partial(done, fakeEvent), 0)

    function done(event) {
      if (event.target !== event.currentTarget) return

      fired = true

      DOM.off(event.target, endEvent, done)
      DOM.css(node, reset)
      callback && callback.call(this)
    }
  }
}

function parents(node){
  var parents = []
    , current = node;

  while(current){
    current = current.parentNode

    if( current && current.nodeType !== 9 && parents.indexOf(current) === -1 )
      parents.push(current)
  }

  return parents
}

function getWindow( node ) {
  return node === node.window 
    ? node : node.nodeType === 9 && node.defaultView;
}

function camelize(str){ 
  return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) 
}

function dasherize(str) {
  return str.replace(/[A-Z]/g, function(char, index) {
    return (index !== 0 ? '-' : '') + char.toLowerCase();
  });
}

function getComputedStyle(node) {
  return node.ownerDocument.defaultView.opener
    ? node.ownerDocument.defaultView.getComputedStyle( node, null )
    : window.getComputedStyle(node, null);
}
