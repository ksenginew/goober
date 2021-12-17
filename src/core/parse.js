let newRule =
  /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
let ruleClean = /\/\*[^]*?\*\/|\s\s+|\n/g;

/**
 * Parse CSS style string
 * @param {String} val
 * @returns {Object}
 */
export let parse = (val, parent) => {
  let tree = [parent];
  let current = "";
  let outer = "";
  let result = "";
  let block;

  let rule = (selector) => {
    if (selector && current) {
      // Get at rules
      let wrappers = tree.filter((rule) => rule[0] == "@");
      // Add selector to wrappers
      wrappers.unshift(selector);
      // Wrap the declaration block with selector and at rules
      wrappers.forEach((wrapper) => (current = wrapper + "{" + current + "}"));
      // Append it to result
      result += current;
      // empty current declaration block
      current = "";
    }
  };

  while ((block = newRule.exec(val.replace(ruleClean, "")))) {
    if (block[4]) {
      // Remove the current entry
      rule(tree.shift());
    } else if (block[3]) {
      rule(tree[0]);
      let selector = block[3];
      if (selector[0] != "@") {
        // Get parent selector
        parent = tree.find((value) => value[0] != "@");
        if (parent)
          selector =
            // Go over the parent and replace the matching multiple selectors if any
            parent.replace(/([^,])+/g, (sel) => {
              // Return the current selector with the key matching multiple selectors if any
              return selector.replace(/(^:.*)|([^,])+/g, (k) => {
                // If the current `k`(key) has a nested selector replace it
                if (/&/.test(k)) return k.replace(/&/g, sel);

                // If there's a current selector concat it
                return sel ? sel + " " + k : k;
              });
            });
      }
      tree.unshift(selector);
    } else if (block[1][0] == "@") {
      // Handling the `@import`
      outer += block[1] + " " + block[2];
    } else {
      // If this isn't an empty rule
      let property = block[1]
        .replace(/_/g, "-")
        .replace(/[A-Z]/g, "-$&")
        .toLowerCase();
      let value = block[2];
      // Push the line for this property
      current += parse.p
        ? // We have a prefixer and we need to run this through that
          parse.p(key, value)
        : // Nope no prefixer just append it
          key + ":" + value + ";";
    }
  }

  return outer + result;
};
