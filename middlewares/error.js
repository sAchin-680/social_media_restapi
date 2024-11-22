const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return resstatus(err.statusCode).json({ error: error.message });
  }
  return res.status(500).json({ error: err.message });
};

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, CustomError };
