module.exports = function (str, id) {
  if (!str || !id) throw new Error('The string name and id must be defined');
  return `The ${str} with the given ID (${id}) was not found`;
};
