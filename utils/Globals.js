const { SYMBOLS, CONS } = require('./Constants');

const GLOBALS = {
  capitalizeFirstLetter: function (str) {
    if (!str || typeof str !== 'string') throw new Error(CONS.INPUT_STRING);
    return this.changeCase(str.trim().charAt(0), false) + str.trim().substring(1);
  },

  changeCase: function (str, isLower = true) {
    if (!str || typeof str !== 'string') throw new Error(CONS.INPUT_STRING);
    return isLower ? str.toLowerCase() : str.toUpperCase();
  },

  isNull: function (param) {
    return !param && typeof param === 'object';
  },

  doSetForwardSlash: function (...endpoint) {
    if (this.isEmptyArray(endpoint)) throw new Error('Your input array should contain at least one element');

    if (endpoint.length === 1) return SYMBOLS.FORWARDSLASH + endpoint[0];

    return SYMBOLS.FORWARDSLASH + endpoint.join(SYMBOLS.FORWARDSLASH);
  },

  isEmptyArray: function (arr) {
    return Array.isArray(arr) && arr.length === 0;
  },
};

exports.glb = GLOBALS;
