/**
 * Stringifies a object structure
 * @param {Object} data
 * @returns {String}
 */
export let stringify = (data) => {
  let out = "";

  for (let key in data) {
    let value = data[key];

    if (typeof data == "object") out += key + "{" + stringify(value) + "}";
    else if (value != undefined) out += p + ":" + value + ";";
  }

  return out;
};
