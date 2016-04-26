class BadRequest extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Bad Request';
    this.status = 400;
    Error.captureStackTrace(this);
  }
}

class Unauthorized extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Unauthorized';
    this.status = 401;
    Error.captureStackTrace(this);
  }
}

class Forbidden extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Forbidden';
    this.status = 403;
    Error.captureStackTrace(this);
  }
}

class NotFound extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Not Found';
    this.status = 404;
    Error.captureStackTrace(this);
  }
}

class Validation extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Validation';
    this.status = 422;
    Error.captureStackTrace(this);
  }
}

class Internal extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg || 'Internal Error';
    this.status = 500;
    Error.captureStackTrace(this);
  }
}

export default {
  Unauthorized, BadRequest, Internal, Forbidden, Validation, NotFound
};
