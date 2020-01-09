var router = require('express').Router();
var User = require('../models/user');

var AddCollege = require('../models/addcollege');
var CollegeReviews = require('../models/collegereviews');




/*router.get('/', function (req, res, next) {
    CollegeReviews.find({},function (err,creviews) {
        if (err) return next(err);
        res.render('main/home' ,{creviews:creviews});
    });
});*/


router.get('/posts/:_id',function(req,res,next) {
    CollegeReviews.findById({ "_id": req.params._id}, function (err,creviews) {
            if (err) return next(err);
            res.render('main/posts', { creviews:creviews });
        });
}); 











router.get('/about', function (req, res) {
    res.render('main/about');
});




router.get('/posts',function(req,res) {
    res.render('main/posts');
});


router.get('/contact',function(req,res) {
    res.render('main/contact');
});


router.get('/reviewslist', function (req, res, next) {
    CollegeReviews.find({}, function (err,creviews) {
        if (err) return next(err);
        res.render('accounts/reviewslist', { creviews: creviews});
    });
});


/*router.get('/userpostlist/:_id', function (req, res, next) {

    CollegeReviews.remove({ _id: req.params._id }, function (err, next) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove posts');
        res.redirect('/userpostslist');
    });
});*/

router.get('/clglistrp/:_id', function (req, res, next) {

    CollegeReviews.remove({ _id : req.params._id }, function (err, next) {
        if (err) return next(err);
        req.flash('msg', 'Successfully remove posts');
        res.redirect('/reviewslist');
    });
});




router.get('/clglistap/:_id/:collegename', function (req, res, next) {

    CollegeReviews.findOne({ collegename: req.params.collegename }, function (err, c) {
        if (err) return next(err);
        if (c) c.flag = 1;
        c.save(function (err) {
            if (err) return next(err);
            req.flash('msg', 'Successfully add reviews');
            res.redirect('/reviewslist');
        });
    });
});


/*router.get('/like/:_id',function(req,res,next) {
    CollegeReviews.findById({ _id : req.params._id }, function (err, c) {
        if (err) return next(err);
        if (c) c.like = c.like+1;
        c.save(function (err) {
            if (err) return next(err);
            res.redirect('/profile');
        });
    });

});



router.get('/dislike/:_id', function (req, res, next) {
    CollegeReviews.findById({ _id: req.params._id }, function (err, c) {
        if (err) return next(err);
        if (c) c.dislike=c.dislike+1;
        c.save(function (err) {
            if (err) return next(err);
            res.redirect('/profile');
        });
    });

});*/

module.exports = router;