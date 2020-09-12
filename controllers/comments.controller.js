const Comment = require("../models/comments.model")


module.exports.create = (req, res, next) => {
    const comment = new Comment({
        ...req.body,
        user: req.currentUser._id
    })

    const redirect = () => {
        res.redirect(`/stablishments/${comment.stablishment}`)
    }

    comment.save()
        .then(redirect)
        .catch(redirect)
}

module.exports.delete = (req, res, next) => {
    Comment.findById(req.params.id)
        .then(comment => {
            if (comment.user.toString() === req.currentUser._id.toString()) {
                Comment.findByIdAndDelete(comment._id)
                    .then(() => {
                        res.redirect(`/stablishments/${comment.stablishment}`)
                    })
                    .catch(next)
            } else {
                res.redirect(`/stablishments/${comment.stablishment}`)
            }
        })
        .catch(next)
}