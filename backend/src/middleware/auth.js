import jwt from "jsonwebtoken";
import  User from "../models/User.js";

// auth middleware — validates JWT and attaches user to req.user
export const auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      console.log('auth: user attached', req.user?.email, req.user?.role);
      return next();
    } catch (err) {
      console.log('auth: token failed', err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    console.log('auth: no token');
    return res.status(401).json({ message: "No token provided" });
  }
};

// permit middleware — returns a middleware that allows only the specified roles
export const permit = (...allowedRoles) => {
  const roles = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
  return (req, res, next) => {
    if (!req.user) {
      console.log('permit: no user on request');
      return res.status(401).json({ message: "Not authorized" });
    }
    console.log('permit: roles=', roles, 'userRole=', req.user.role);
    if (!roles.includes(req.user.role)) {
      console.log('permit: access denied for role', req.user.role);
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
