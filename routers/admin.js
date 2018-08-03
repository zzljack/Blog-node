var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/category');
var Content = require('../models/content');
router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        res.set('Content-Type', 'text/html;charset=utf-8');
        res.send('对不起，你不是管理员，无法进入管理员页面');
        return;
    }
    next();
})

router.get('/', function(req, res, next){
    res.render('admin/index')
});
// 用户管理
router.get('/user', function(req, res, next){
    // 从数据库读取所有的用户数据
    // limit(Number):限制获取数据条数
    // skip(Number):忽略数据的条数
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    User.count().then(function(count){
        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page= Math.max(page, 1);
        var skip = (page - 1)*limit;
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                'userInfo': req.userInfo,
                'users': users,
                'page':page,
                'pages':pages,
                'count':count,
                'limit':limit,
                'url': '/admin/user'
            })
        })
    })
})

// 分类首页
router.get('/category', function(req, res, next){
    // 从数据库读取所有的用户数据
    // limit(Number):限制获取数据条数
    // skip(Number):忽略数据的条数
    var page = Number(req.query.page || 1);
    var limit = 5;
    var pages = 0;
    Category.count().then(function(count){
        // 计算总页数
        pages = Math.ceil(count/limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page= Math.max(page, 1);
        var skip = (page - 1)*limit;
        // sort排序（1：升序，-1：降序）
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categoryies){
            res.render('admin/category_index',{
                'userInfo': req.userInfo,
                'categoryies': categoryies,
                'page':page,
                'pages':pages,
                'count':count,
                'limit':limit,
                'url': '/admin/category'
            })
        })
    })
})

// 分类的添加
router.get('/category/add', function(req, res, next){
    res.render('admin/category_add',{
        'userInfo': req.userInfo
    })
})

// 分类的保存
router.post('/category/add',function(req, res){
    var name = req.body.name || "";
    if(name == ''){
        res.render('admin/error',{
            'userInfo':req.userInfo,
            'message': '名称不能为空'
        })
    }
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                'userInfo':req.userInfo,
                'message': '分类名称已经存在'
            })
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            'userInfo': req.userInfo,
            'message': '分类保存成功',
            'url':'/admin/category'
        })
    })
})
// 分类修改
router.get('/category/edit', function(req, res){
    // 获取要修改分类的信息，并且用表单的形式展现出来
    var id = req.query.id || "";
    Category.findOne({
        "_id": id
    }).then(function(category){
        if(!category){
            res.render("admin/error",{
                "userInfo": req.userInfo,
                "message": '分类信息不存在'
            })
        }else{
            res.render("admin/category_edit",{
                "userInfo": req.userInfo,
                "category":category
            })
        }
    })
})
// 分类修改保存
router.post('/category/edit', function(req, res){
    // 获取要修改分类的信息，并且用表单的形式展现出来
    var id = req.query.id || "";
    // 获取post提交过来的名称
    var name = req.body.name || "";
    // 要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render("admin/error",{
                "userInfo": req.userInfo,
                "message": '分类信息不存在'
            })
            return Promise.reject();
        }else{
            // 当用户没有做任何的修改提交的时候
            if( name == category.name ){
                res.render("admin/success",{
                    "userInfo": req.userInfo,
                    "message": '修改成功',
                    'url': '/admin/category'
                })
                return Promise.reject();
            }else{
                // 要修改的名称是否在数据库已经存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message: '数据库中已经存在同名分类'
            })
            return Promise.reject();
        }else{
            return Category.update({
                _id: id
            },{
                name: name
            })
        }
    }).then(function(){
        res.render("admin/success",{
            "userInfo": req.userInfo,
            "message": '修改成功',
            'url': '/admin/category'
        })
    })
})

// 分类删除
router.get('/category/delete', function(req, res){
    // 获取到要删除的分类id
    var id = req.query.id || "";
    Category.remove({
        _id: id
    }).then(function(){
        res.render("admin/success",{
            "userInfo": req.userInfo,
            "message": '删除成功',
            'url': '/admin/category'
        })
    })
})

// 内容首页
router.get('/content', function(req, res){
    // 从数据库读取所有的用户数据
    // limit(Number):限制获取数据条数
    // skip(Number):忽略数据的条数
    // sort()排序（1：正序，-1倒序）
    var page = Number(req.query.page || 1),
        limit = 10,
        pages = 0;
    Content.count().then(function(counts){
        // 计算总页数
        pages = Math.ceil(counts/limit);
        // 取值不能超过总页数
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);
        // 忽略的条数
        var skip = (page-1)*limit;
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            console.log(contents);
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                'page':page,
                'pages':pages,
                'count':counts,
                'limit':limit,
                'url': '/admin/content'
            })
        })

    })
    
})
// 内容添加页面
router.get('/content/add', function(req, res){
    Category.find().sort({_id: -1}).then(function(categoryies){
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categoryies: categoryies
        })
    })
})
// 内容保存
router.post('/content/add', function(req, res){
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    })
})
// 内容修改
router.get('/content/edit',function(req, res){
    var id = req.query.id || '';
    Category.find().sort({_id: -1}).then(function(categoryies){
        Content.findOne({
            _id: id
        }).populate('category').then(function(contents){
            if(!contents){
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '指定内容不存在'
                })
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo: req.userInfo,
                    contents: contents,
                    categoryies: categoryies
                })
            }
        })
    })
})
// 内容修改保存
router.post('/content/edit', function(req, res){
    var id = req.query.id || '';
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    Content.update({
        _id: id
    },
    {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容修改成功',
            url: '/admin/content'
        })
    })
})
// 内容删除
router.get('/content/delete', function(req, res){
    var id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容删除成功',
            url: '/admin/content'
        })
    })
})

module.exports = router;