import { hash } from "./to-hash";
import { update } from "./update";
import { stringify } from "./stringify";
import { parse } from "./parse";
import { compile } from "./core/compile";
import { getSheet } from "./core/get-sheet";

/**
 * In-memory cache.
 */
let cache = {};

let argsToString = (args) => {
  if (args[0].raw) return compile(args, props);
  let val;
  for (let arg of args) {
    if (arg.call) arg = arg(props);
    val += typeof arg == "object" ? stringify(arg) : arg;
  }
  return val;
};

/**
 * Generates the needed className
 * @param {(String|Object)[]} args
 * @param {Object} props
 * @param {Object} target StyleSheet target
 * @param {Boolean} global Global flag
 * @param {Boolean} append Append or not
 * @param {Boolean} keyframes Keyframes mode. The input is the keyframes body that needs to be wrapped.
 * @returns {String}
 */
let style = (args, props, target, global, append, keyframes) => {
  let input = argsToString(args);

  // Retrieve the className from cache or hash it in place
  let className = cache[input] || (cache[input] = hash(input));

  // If there's no entry for the current className
  if (!cache[className]) {
    // Parse it
    cache[className] = parse(
      // For keyframes
      keyframes ? "@keyframes " + className + "{" + input + "}" : input,
      global ? "" : "." + className
    );
  }

  // add or update
  update(cache[className], getSheet(target), append);

  // return hash
  return className;
};
