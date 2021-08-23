
const User = require('../models/user')

module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const newUser = await User.register(user, password)
        req.login(newUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Successfully Logged Out')
    res.redirect('/campgrounds')
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!')
    const url = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(url)
}