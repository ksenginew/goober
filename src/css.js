import { style } from "./core/style";

/**
 * css entry
 * @param {String|Object|Function} val
 */
function css() {
  let ctx = this || {};
  return style(arguments, ctx.p, ctx.target, ctx.g, ctx.o, ctx.k);
}

/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
let glob = css.bind({ g: 1 });

/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
let keyframes = css.bind({ k: 1 });

export { css, glob, keyframes };
