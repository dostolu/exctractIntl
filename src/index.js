/**
 * Extract Intl data from provided data.
 * - Use data as a source
 * - Find all keys by mask: $name:uk
 * - Get only keys listed in config
 * - Create result as a array of objects, ready to be exported to mongo
 * - If key is not set, use needle
 * - If key is not found create just empty value
 * - Exception is UK lang
 *  - as we check Ukraine, it might be in the key without language clarification
 * @param {Object} data - Initial data to search in
 * @param {String} needle - String to search for
 * @param {String} key - String to insert as a key
 * @param {Object} configObj - config object
 * @returns {Array.<Object>} intl
 * @returns {String} intl.key
 * @returns {String} intl.val
 */
module.exports = (data, needle, key = null, configObj) => {
  const result = [];
  // Get array keys for the tags
  const keys = Object.keys(data);
  // Get available languages (clone array)
  const languages = configObj.intl.available.slice(0);
  // Search for the names with lang. i.e. name:uk
  const re = new RegExp(`^${needle}:([a-z]{2})$`, 'i');
  keys.map(val => {
    const found = val.match(re);
    if (found) {
      const lang = found[1];
      // Check available languages so we will use only those
      const index = languages.indexOf(lang);
      if (index >= 0) {
        result.push({
          key: `${key || needle}.${lang}`,
          val: data[val]
        });
        // And remove lang from array as used
        languages.splice(index, 1);
      }
    }
  });
  // If we have languages still in the list make just empty strings
  if (languages.length) {
    languages.map(lang => {
      if (lang === 'uk') {
        // Ukrainian might be with default key as we getting info about Ukraine
        // Like: [ name:en, name ] => [ name.en, name.uk ]
        result.push({
          key: `${key || needle}.${lang}`,
          val: (needle in data) ? data[needle] : ''
        });
      } else {
        result.push({
          key: `${key || needle}.${lang}`,
          val: ''
        });
      }
    });
  }
  return result;
};
