module.exports = function(req, res, next) {
  // passport adds this to the request object
  if (!req.isAuthenticated()) {
    res.redirect('/users/login');
  }
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  }
};
