const handleMongooseError = (error, data, next) => {
  // error.status = 400;
  const { name, code } = error;
  error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  next();
};

module.exports = handleMongooseError;
