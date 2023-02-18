module.exports = function (id, data, title = 'Todo') {
  if (!id) throw new Error(`The id: ${id} of the record you want to delete must be defined`);
  return {
    success: true,
    message: `${title} with ID: ${id} has been deleted from db`,
    deletedData: data,
  };
};
