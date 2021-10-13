const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const verifiedUserInfo = jwt.verify(req.body.token, process.env.JWT_SECRET);
    req.verifiedUserInfo = verifiedUserInfo;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
