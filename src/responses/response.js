class Response {
  constructor(status, responseCode, success, message, data, error = null) {
    this.status = status;
    this.responseCode = responseCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}

module.exports = {
  successCode(code, message, data) {
    return new Response(200, code, true, message, data, null);
  },
  badRequest(code, message, error) {
    return new Response(400, code, false, message, null, error);
  },
  notFound(code, message, error) {
    return new Response(404, code, false, message, null, error);
  },
  validationError(code, message, error) {
    return new Response(422, code, false, message, null, error);
  },
  serverError(code, message, error) {
    return new Response(500, code, false, message, null, error);
  },
  failAuthorization(code, message, error) {
    return new Response(409, code, false, message, null, error);
  },
  forbidden(code, message, error) {
    return new Response(403, code, false, message, null, error);
  },
  requestTimeOut(code, message, error) {
    return new Response(408, code, false, message, null, error);
  },
  invalidToken(code, message, error) {
    return new Response(401, code, false, message, null, error);
  },
  contentNotFound(code, message, error) {
    return new Response(204, code, false, message, null, error);
  },
};
