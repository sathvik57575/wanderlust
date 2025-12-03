let { User } = require('../models/user')
const { customExpressError } = require('../utils/customExpressError');

module.exports.getSignup = (req, res) => {
    res.render('users/signup')
}

module.exports.postSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({
            email, username
        })
        let user = await User.register(newUser, password)
        console.log(user);

        req.login(user, (err) => {
            if (err) {
                next(err); //no need to do this in express 5.x.x
            }
            req.flash('success', 'Welcome to WanderLust')
            res.redirect('/')
        })
    }
    catch (err) {
        if (err.name == 'UserExistsError') {
            req.flash('failure', err.message)
        } else {
            console.log(err);
            req.flash('failure', err.message)
        }
        return res.redirect('/user/signup')
    }
}


module.exports.getLogin = (req, res) => {
    res.render('users/login')
}

module.exports.postLogin = async (req, res) => {

    req.flash('success', 'welcome back to wanderlust, you are logged in now!')


    const redirectUrl = res.locals.remember || '/'

    console.log(req.session.remember);
    // console.log(redirectUrl, res.locals.remember);
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            next(err) //no need to do this as we're using express 5.x.x, handled automatically
        }

        //if not error do this
        req.flash('success', 'You are logged out!')
        res.redirect('/')
    })
}


//added later
module.exports.getEdit = async (req, res, next) => {
    let id = req.user._id;

    let thisUser = await User.findById(id);

    res.render('users/edit', { thisUser });
}
module.exports.postEdit = async (req, res, next) => {
    try {
        let { username, email, oldpassword, newpassword } = req.body;

        let user = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });
        let sameuser = await User.findById(req.user._id);

        console.log(user);

        if (oldpassword && newpassword) {
            await user.changePassword(oldpassword, newpassword);
        }

        req.login(user, (err) => {
            req.flash("success", "Profile updated successfully!");
            res.redirect('/');
        });
    } catch (err) {
        req.flash("failure", "Old Password is incorrect");
        res.redirect('/user/edit')
    }
};
