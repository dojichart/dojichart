"use strict";

module.exports = function(canvas) {
  // get the canvas and context
  var context = canvas.getContext('2d'),
    // now default all the dimension info
    srcx = 0,
    srcy = 0,
    srcw = canvas.width,
    srch = canvas.height,
    desx = srcx,
    desy = srcy,
    desw = srcw,
    desh = srch,

    // finally query the various pixel ratios
    devicePixelRatio = window.devicePixelRatio || 1,
    backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1,

    ratio = devicePixelRatio / backingStoreRatio;

  // upscale the canvas if the two ratios don't match
  if (devicePixelRatio !== backingStoreRatio) {

    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;

    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';

    // now scale the context to counter
    // the fact that we've manually scaled
    // our canvas element
    context.scale(ratio, ratio);
  }

  return canvas;
}
