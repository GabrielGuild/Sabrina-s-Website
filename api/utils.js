function requireLogin(req, res, next) {
  if (!req.user) {
    res.status(401)
    res.send({
      name: "MissingUserError",
      message: "You must be logged in to perform this action.",
      error: "User not logged in."
    });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    res.status(401).send({
      name: "NonAdminError",
      message: "You must be logged in as an Administrator to perform this action.",
      error: "User is not an Administrator."
    });
  }
  next();
}
  
module.exports = { requireLogin, requireAdmin }