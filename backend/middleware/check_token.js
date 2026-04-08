const JWT = require("jsonwebtoken");

function checkToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Malformed token",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.auth = {
      userId: Number(decoded.sub),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { checkToken };
