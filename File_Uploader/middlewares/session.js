const validateSession = (req, res, next) => {
  if (req.session.user) {
    console.log('Iniciaste sesión');
    return next();
  }
  return res.redirect('/');
};

module.exports = validateSession;
