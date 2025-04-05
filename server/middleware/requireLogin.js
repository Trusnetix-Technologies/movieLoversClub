const jwt = require("jsonwebtoken");

// ==== GENERATE TOKEN ====
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const requireLogin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    console.log(err);
    if (err) {
      console.log("Unauthorized access attempt");
      return res.status(401).send({ error: "You must log in!" });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  generateToken,
  requireLogin,
};
