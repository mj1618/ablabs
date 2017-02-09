export const checkAuth = (req, res, next) => {
  if (!req.session.email) {
    res.redirect('/login');
  } else {
    next();
  }
}
