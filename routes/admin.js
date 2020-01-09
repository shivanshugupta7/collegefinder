var router = require('express').Router();
var AdminModel = require("../models/admin");
var bcrypt = require('bcrypt-nodejs');

var AddCollege= require('../models/addcollege');



router.get('/add-college',function(req,res,next) {
    res.render('admin/add-college',{message: req.flash("success") });
});


router.post('/add-college',function(req,res,next) {
    var addcollege = new AddCollege();
    addcollege.rname = req.body.rname;
    addcollege.desig=req.body.desig;
    addcollege.cname=req.body.cname;

    addcollege.save(function(err) {
        if(err) return next(err);
        req.flash("success","Successfully added a college");
        return res.redirect('/add-college');
    });
});







router.get('/adminprofile', function (req, res, next) {

        res.render('accounts/adminprofile');
});

router.get('/adminlogin', function (req, res, next) {

        res.render('accounts/adminlogin', { title: 'College Finder', msg: '' });

});




router.post('/adminlogin', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var checkuser = AdminModel.findOne({ email: email });
    checkuser.exec((err, data) => {
        if (err) throw err;
        else if (data == null) {
            res.render('accounts/adminlogin', { title: 'College Finder', msg: 'Invalid Email' });
        }
        else {
            var getPassword = data.password;
            if (bcrypt.compareSync(password, getPassword)) {
                res.redirect("/adminprofile");

            }
            else {
                res.render('accounts/adminlogin', { title: 'College Finder', msg: 'Invalid Password' });
            }
        }



    });


});


router.get('/adminlogout', function (req, res, next) {
    res.redirect('/adminlogin');

});

module.exports = router;