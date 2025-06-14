import jwt from 'jsonwebtoken';

export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
