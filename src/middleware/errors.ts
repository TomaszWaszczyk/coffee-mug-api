export class HttpError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details?: unknown) {
    super(message, 400, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource Not Found", details?: unknown) {
    super(message, 404, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict", details?: unknown) {
    super(message, 409, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(message, 500, details);
  }
}

export default HttpError;
