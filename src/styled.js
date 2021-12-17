import { style } from "./core/style";
import { parse } from "./core/parse";

let h, useTheme, fwdProp;
function setup(pragma, prefix, theme, forwardProps) {
  // This one needs to stay in here, so we won't have cyclic dependencies
  parse.p = prefix;

  // These are scope to this context
  h = pragma;
  useTheme = theme;
  fwdProp = forwardProps;
}

/**
 * styled function
 * @param {string} tag
 * @param {function} forwardRef
 */
function styled(tag, forwardRef) {
  let ctx = this || {};

  return function wrapper() {
    let args = arguments;

    function Styled(props, ref) {
      // Grab a shallow copy of the props
      let props = Object.assign({}, props);

      // Keep a local reference to the previous className
      let className = props.className || Styled.className;

      // _ctx.p: is the props sent to the context
      let props = Object.assign({ theme: useTheme && useTheme() }, props);

      // Set a flag if the current components had a previous className
      // similar to goober. This is the append/prepend flag
      // The _empty_ space compresses better than `\s`
      let append = / *go\d+/.test(className);

      props.className =
        // Define the new className
        style(args, props, ctx.taget, 0, append) +
        (className ? " " + className : "");

      // If the forwardRef fun is defined we have the ref
      if (forwardRef) props.ref = ref;

      // Assign the _as with the provided `tag` value
      let _as = tag;

      // If this is a string -- checking that is has a first valid char
      if (tag[0]) {
        // Try to assign the _as with the given _as value if any
        _as = props.as || tag;
        // And remove it
        delete props.as;
      }

      // Handle the forward props filter if defined and _as is a string
      if (fwdProp && _as[0]) {
        fwdProp(_props);
      }

      return h(_as, props);
    }

    return forwardRef ? forwardRef(Styled) : Styled;
  };
}

export { styled, setup };
