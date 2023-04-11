

const router = require('express').Router();
const sequelize = require('../config/conncetion');
const { Post, User, Comment } = require ('../models');
const isAuth = require('./api/userRoutes');


router.get('/', isAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [ 
            'id',
            'title',
            'content',
            'dateCreated'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'commentTxt', 'post_id', 'user_id', 'dateCreated'],
            include: { 
                model: User,
                atrributes: ['username']
            }
        },
    {
        model: User,
        attributes: ['username']
    }
]
})
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({
            plain: true
        }));
        res.render('dashboard', {
            posts, 
            loggedIn: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', isAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        atrributes: [
            'id',
            'title',
            'content',
            'dateCreated'
        ],
        include: [{
            model: Comment, 
            attributes: ['id', 'commentTxt', 'post_id', 'user_id', 'dateCreated'],
            include: {
                model: User,
                atrributes: ['username'] 
            }
        },
        {
            model: User,
            atrributes: ['username']
        }
    ]
})
.then (dbPostData => {
    if (!dbPostData) {
        res.status(404).json({
            message: 'No post found with this id :('
        });
        return;
    }

    const post = dbPostData.get({
        plain: true
    });

    res.render('edit-post', {
        post, 
        loggedIn: true
    });
})
.catch(err => {
    console.log(err);
    res.status(500).json(err);
});
})
router.get('/new', (req, res) => {
    res.render('add-post', {
        loggedIn: true
    })
})

module.exports = router;