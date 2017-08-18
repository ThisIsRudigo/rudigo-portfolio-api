var express = require('express');
var router = express.Router();

var Posts = require('../../models/posts');
var Verify = require('../../routers/verify');


/*** END POINT FOR GETTING ALL POST BY LOGGED IN USERS */
router.get('/', Verify.verifyOrdinaryUser, function(req, res){

        Posts.find({})
            .populate({
                path: 'postedBy',
                select:'username picture'
            })
            .populate({
                path:'comments.postedBy',
                select:'username picture'
            })
            .sort({date: -1})

            .exec(function(err, post) {
                if (err) {
                    return res.status(401).json({
                        message: 'You are not authenticated and cannot perform the action '
                    });
                }
                res.json(post);
            });
    });

    // creating new post by registered users to database
/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.post('/', Verify.verifyOrdinaryUser, function(req, res){

        req.body.postedBy = req.user_id;

        Posts.create(req.body, function (err, post) {
            if (err) {
                return res.status(401).json({
                    message: 'You are not authenticated and cannot perform the action '
                });
            }

            var id = post._id;
            res.writeHead(200,{
                'content-Type': 'text/plain'
            });
            res.end(' post ID : '+ id );
        });
    });

/*** END POINT FOR GETTING A POST BY LOGGED IN USERS */
router.get('/:PostsId', Verify.verifyOrdinaryUser, function(req, res){

        Posts.findById(req.params.PostsId)
            .populate({
                path: 'postedBy',
                select:'username picture'
            })
            .populate({
                path:'comments.postedBy',
                select:'username picture'
            })
            .sort({date: -1})

            .exec(function(err, post) {
                if (err) {
                    return res.status(401).json({
                        message: 'You are not authenticated and cannot perform the action '
                    });
                }
                res.json(post);
            });
    });

/*** END POINT FOR EDITING A POST BY LOGGED IN USERS */
router.put('/:PostsId', Verify.verifyOrdinaryUser, function(req, res){

        Posts.findByIdAndUpdate(req.params.PostsId, {
            $set: req.body
        },{
            new: true
        }, function (err, post) {

            if ((req.params.PostsId).postedBy != req.user_id){

                var err = new Error('You are not authorized to do this');
                err.status = 403;
                return next(err);
            }

            res.json(post);
        });
    });


/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.delete('/:PostsId', Verify.verifyOrdinaryUser, function(req, res, next){

        Posts.remove(req.params.PostsId, function (err, resp) {

            if ((req.params.PostsId).postedBy != req.user_id){

                var err = new Error('you re not authorized');
                err.status = 403;
                return next(err);
            }
            res.json(resp);
        })
    });

/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.get('/:PostsId/comments', Verify.verifyOrdinaryUser, function(req, res, next){

    Posts.findById(req.params.PostsId)
        .populate({
            path: 'postedBy',
            select:'username picture'
        })
        .populate({
            path:'comments.postedBy',
            select:'username picture'
        })
        .sort({date: -1})

        .exec(function(err, post) {
            if (err) {
                return res.status(401).json({
                    message: 'You are not authenticated and cannot perform the action '
                });
            }
        res.json(post);
    });
});

/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.post('/:PostsId/comments', Verify.verifyOrdinaryUser, function(req, res, next){

    //    posting a new comment to a post
     Posts.findById(req.params.PostsId, function (err, post) {

         if (err) {
             return res.status(401).json({
                 message: 'You are not authenticated and cannot perform the action '
             });
         }
            req.body.postedBy = req.user_id;
            post.comments.push(req.body);
            post.save(function (err, post) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                res.json(post)
            });
        });
    });

// /*** END POINT FOR DELETING ALL COMMENTS FROM THE POST BY LOGGED IN ADMIN */
// router.get('/:PostsId/comments', Verify.verifyOrdinaryUser, function(req, res, next){
    //
    // .delete(Verify.verifyAdmin,function (req, res) {
    //
    //     Posts.findById(req.params.PostsId, function (err, post) {
    //         if (err){
    //             res.error(error);
    //         }
    //         for (var i = (post.comments.length - 1); i>= 0; i--){
    //             post.id(post[i]._id).remove();
    //         }
    //
    //         post.save(function (err, result) {
    //             if (err){
    //                 res.error(error);
    //             }
    //             res.writeHead(200, {
    //                 'content-Type': 'text/plain'
    //             });
    //             res.end('delete all comments')
    //         });
    //     });
    // });

/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.get('/:PostsId/comments/:commentsId', Verify.verifyOrdinaryUser, function(req, res, next){

        Posts.findById(req.params.PostsId)
            .populate({
                path:'comments.postedBy',
                select:'username picture'
            })
            .sort({date: -1})

            .exec(function(err, post) {
                if (err) {
                    return res.status(401).json({
                        message: 'You are not authenticated and cannot perform the action '
                    });
                }

                res.json(post.comments.id(req.params.commentsId));
            });
    });

/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.put('/:PostsId/comments/:commentsId', Verify.verifyOrdinaryUser, function(req, res, next){

   Posts.findById(req.params.PostsId, function(err, post){
       if (err) {
           return res.status(401).json({
               message: 'You are not authenticated and cannot perform the action '
           });
       }
       if (post.comments.id(req.params.commentId).postedBy
           != req.decoded._doc._id){

           var err = new Error('you re not authorized');
           err.status = 403;
           return next(err);
       }
        post.comments.id(req.params.commentsId).remove();

        req.body.postedBy = req.user_id;

        post.comments.push(req.body);

        post.save(function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            res.json(post);
        });
    });
});

/*** END POINT FOR CREATING A POST BY LOGGED IN USERS */
router.delete('/:PostsId/comments:commentsId', Verify.verifyOrdinaryUser, function(req, res, next){

    Posts.findById(req.params.PostsId, function (err, post) {

        if (post.comments.id(req.params.commentsId).postedBy
            != req.user_id){

            var err = new Error('you re not authorized');
            err.status = 403;
            return next(err);
        }
        post.comments.id(req.params.comments).remove();

        post.save(function (err, resp) {
            if (err){
                res.error(error);
            }

            res.json(resp);
        });
    });
});


module.exports = router;