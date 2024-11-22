const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return resstatus(err.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: err.message });
};

class CustomError extends Error {
  constructor(message, statusCode = 500) {
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, CustomError };
