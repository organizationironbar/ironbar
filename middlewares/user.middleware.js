const User = require('../models/user.model')

module.exports.projectOwner = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (user._id === req.currentUser.id.toString()) {
        req.user = user
        next()
      } else {
        res.redirect(`/stablishments/${req.params.id}`)
      }
    })
    .catch(next)
}