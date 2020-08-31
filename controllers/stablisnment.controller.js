
const User = require("../models/user.model")



module.exports.stablishmentsList = (req, res, next) => {
  // const criteria = {}

  // if (req.query.search) {
  //   res.locals.search = req.query.search
  //   criteria['$or'] = [
  //     { name: new RegExp(req.query.search, "i") },
  //     { ['author.name']: new RegExp(req.query.search, "i") },
  //     { ['staff.name']: new RegExp(req.query.search, "i") }
  //   ]
  // }

  User.find({ type: 'stablishment' })
    .populate('comments')
    .populate('score')
    .then(stablishments => {
      console.log(stablishments)
      res.render('stablishments/list', { stablishments })
    })
    .catch(next)
}