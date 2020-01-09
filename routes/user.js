var router = require('express').Router();
var User = require('../models/user');
var Admin = require("../models/admin");
var College = require("../models/addcollege");
var rev = require("../models/collegereviews");
var imageModel = require("../models/profilepic");
var multer = require('multer');
var path = require('path');
var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var CollegeReviews = require('../models/collegereviews');

var AddCollege = require('../models/addcollege');



function checkLoginUser(req,res,next)
{
    var userToken = localStorage.getItem('userToken');
    try{
        var decoded = jwt.verify.token(userToken,'loginToken');

    }catch(err)
    {
        res.redirect("/login1");
    }
    next();

}

if(typeof localStorage === "undefined" || localStorage === null)
{
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}









var images = imageModel.find({});
router.use(express.static(__dirname + "./public/"));

function checkEmail(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var email = req.body.email;
    var checkdupemail = User.findOne({ email: email });
    checkdupemail.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('accounts/signup1', { loginUser:loginUser,title: 'College Finder', msg: ' User with this email already exists' });
        }
        next();
    });

}

function checkUsername(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var uname = req.body.username;
    var checkdupname = User.findOne({ username: uname });
    checkdupname.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('accounts/signup1', { loginUser:loginUser,title: 'College Finder', msg: ' User already exists' });
        }
        next();
    });

}

router.get('/profile',function (req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    if(loginUser)
    {
        res.render('accounts/profile' ,{loginUser:loginUser});
    }
    else
    {
        res.redirect('/login1');
    }
});


router.get('/',function (req, res, next) {
        var loginUser = localStorage.getItem('loginUser');
        if(loginUser)
            res.render('main/home',{loginUser:loginUser});
        else
        {
            res.render("main/home",{loginUser:null});
        }
});






router.get('/login1', function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser){
        res.redirect('/profile');
    }
    else{
        res.render('accounts/login1', { loginUser:null, title: 'College Finder', msg: '' });
    }

});




router.post('/login1', function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var email = req.body.email;
    var password = req.body.password;
    var checkuser = User.findOne({ email: email });
    checkuser.exec((err, data) => {
        if (err) throw err;
        else if (data == null) {
            res.render('accounts/login1', { loginUser: null,title: 'College Finder', msg: 'Invalid Email' });
        }
        else {
            var getUserID = data._id;
            var getPassword = data.password;
            if (bcrypt.compareSync(password, getPassword)) {
                var token =jwt.sign({ userID: getUserID} , 'loginToken');
                localStorage.setItem('userToken',token);
                localStorage.setItem('loginUser',email);
                res.redirect("/profile");
            }
            else {
                res.render('accounts/login1', { loginUser: null,title: 'College Finder', msg: 'Invalid Password' });
            }
        }



    });


});




router.get('/signup1',function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
        res.redirect('/profile');
    }
    else {
        res.render('accounts/signup1', { loginUser: null, title: 'College Finder', msg: '' });
    }
});

router.post('/signup1', checkUsername, checkEmail, function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var username = req.body.username;
    var email = req.body.email;
    var cnfpassword = req.body.cnfpassword;
    var password = req.body.password;

    if (password != cnfpassword) {
        res.render('accounts/signup1', {  loginUser:null ,title: 'College Finder' ,msg: ' Password Not Match ' });
    }
    else {
        if (password.length < 6) {
            res.render('accounts/signup1', { loginUser:null,title: 'College Finder', msg: ' Password must be of atleast 6 characters ' });
        }
        else {
            var userDetails = new User({
                username: username,
                email: email,
                password: password

            });
            userDetails.save((err, doc) => {
                if (err) throw err;
                res.render('accounts/signup1', { loginUser:null, title: 'College Finder',  msg: ' User Registered Successfully' });

            })

        }


    }


});



router.get('/collegereviews/:cname', function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');

    AddCollege.findOne({ cname: req.params.cname }, function (err, college) {

        if (err) return next(err);
        res.render('main/collegereviews', { loginUser:loginUser,college: college });
    });

});

router.post('/collegereviews/:cname', function (req, res, next) {
    AddCollege.findOne({ cname: req.params.cname }, function (err, clg) {

        if (err) return next(err);

        var cr = new CollegeReviews();
        cr.collegename = clg.cname;
        cr.username = req.body.username;
        cr.rtitle = req.body.rtitle;
        cr.content = req.body.content;
        cr.year = req.body.year;
        cr.branch = req.body.branch;
        cr.qualities.placements = req.body.ppo;
        cr.qualities.infrastructure = req.body.infra;
        cr.qualities.campuslife = req.body.ccl;
        cr.qualities.faculty = req.body.fcc;
        cr.rating = cr.qualities.placements + cr.qualities.campuslife + cr.qualities.faculty + cr.qualities.infrastructure;
        cr.save(function (err, cr) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
});

/*var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('file');






router.post('/image-upload', upload, function (req, res, next) {
    var imageFile = req.file.filename;
    var success = req.file.filename + " uploaded successfully";
    var imageDetails = new imageModel({
        imagename: imageFile,
    });
    imageDetails.save(function (err, doc) {
        if (err) throw err;
        images.exec(function (err, data) {
            if (err) throw err;
            res.render('accounts/image-upload', { title: 'Upload File', records: data, success: success });

        });
    });



});


router.get('/image-upload', function (req, res, next) {
    images.exec(function (err, data) {
        if (err) throw err;
        res.render('accounts/image-upload', { title: 'Upload File', records: data, success: '' });
    });
});
*/




router.get('/usercollegelist',function (req, res, next) 
{
    var loginUser = localStorage.getItem('loginUser');
    res.render('accounts/usercollegelist',{loginUser:loginUser});
});


router.get('/userpostlist',function (req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    User.findOne({email:loginUser},function(err,data) 
    {
        if(err) throw err;
        res.render('accounts/userpostlist', { loginUser:loginUser,data:data});
    });
});


router.get('/clglist', function (req, res, next) {
    College.find({}, function (err, college) {
        if (err) return next(err);
        res.render('accounts/collegelist', { college: college, msg: req.flash('msg') });
    });
});

    router.get('/clglistrc/:_id', function (req, res, next) 
    {

    College.remove({ _id:req.params._id }, function (err) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove college');
        res.redirect('/clglist');
    });
});

router.get('/clglistac/:_id', function (req, res, next) {

    College.findById({ _id : req.params._id }, function (err, clg) {
        if (err) return next(err);
        if (clg) clg.flag = 1;
        clg.save(function (err) {
            if (err) return next(err);
            req.flash('msg', 'Successfully add college');
            res.redirect('/clglist');
        });
    });
});





router.get('/clglist/:_id/:cname', function (req, res, next) {

    College.findOne({ cname: req.params.cname }, function (err, clg) {
        if (err) return next(err);
        if(clg) clg.flag = 1;
        clg.save(function(err) {
            if (err) return next(err);
            req.flash('msg', 'Successfully add college');
            res.redirect('/clglist');
        });
    });
});


















router.get('/logout1', function (req, res, next) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/login1');

});



/*router.get('/edit-profile',function(req,res,next) {
    res.render('accounts/edit-profile',{ message: req.flash('success')});
});

router.post('/edit-profile',function(req,res,next) {
    User.findOne({ _id: req.user._id }, function(err,user) {
        if(err) return next(err);
        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.address) user.address = req.body.address;
        user.save(function(err) {
            if(err) return next(err);
            req.flash('success','Successfully Edited your profile');
            return res.redirect('/edit-profile');
        });
    });
});*/



module.exports = router;