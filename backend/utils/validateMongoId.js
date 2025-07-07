module.exports = function validateMongoId(id) {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    throw new Error("Invalid MongoDB ObjectId");
  }
};
