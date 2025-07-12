const {
  ApiResponse: { serverError, validationError },
} = require("../responses");
const { encrypt, decrypt } = require("../util/crypto.util");
const { jwtVerify } = require("../util/jwt.util");

const requestToken = (req) => {
  const { requesttoken } = req.headers;

  if (!requesttoken) {
    return false;
  }

  let plaintext = decrypt(requesttoken);

  if (plaintext == null) {
    return false;
  }

  let cryptoData = plaintext.trim().toLowerCase();

  const cryptoString = process.env["CRYPTO_PASSWORD_" + process.env.RUN_MODE];

  cryptoData == cryptoString;
  return true;
};

const bearerToken = (req) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return {
      valid: false,
      message: "Token not found",
    };
  }

  let parts = authorization.split(" ");
  let token = parts[1];
  let tokenLength = token?.split(".");

  if (parts.length != 2 && !/^Bearer$/i.test(parts[0]) && tokenLength != 3) {
    return {
      valid: false,
      message: "Invalid token",
    };
  }

  let decoded = jwtVerify(token);
  try {
    req.headers.payload = decoded;
    return {
      valid: true,
    };
  } catch (error) {
    return {
      valid: false,
      message: error.message,
    };
  }
};

const authToken = (req, res, next) => {
  try {
    let requestData = requestToken(req);
    let bearerData = bearerToken(req);

    if (requestData == true && bearerData.valid == true) {
      next();
    } else {
      return res
        .status(422)
        .send(
          validationError(
            0,
            bearerData.message ? bearerData.message : "Invalid token"
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .send(serverError(0, "Something went wrong", error.message));
  }
};

const productAuth = (req, res, next) => {
  return authToken(req, res, next);
};

module.exports = {
  authToken,
  productAuth,
};
