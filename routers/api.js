var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

// 统一返回格式
var responseData;
router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    }
    next();
});

// 用户注册（注册逻辑）
router.post('/user/register', function(req, res, next){
    var username = req.body.username,
        password = req.body.password,
        repassword = req.body.repassword;
    // 用户名不能为空
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    // 密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    // 两次密码必须一致
    if(repassword != password){
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }
    // 用户名是否被注册了，如果数据库已经存在和我们要注册的用户名同名的数据，表示该用户已经被注册
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            // 标识数据库里有该数据
            responseData.code = 4;
            responseData.message = '该用户已经被注册';
            res.json(responseData);
            return;
        }
        // 保存用户信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.message="注册成功";
        res.json(responseData);
    })
})

// 用户登录（登录逻辑）

router.post('/user/login', function(req, res, next){
    var username = req.body.username,
        password = req.body.password;
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名和密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = "登录成功";
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
    })
})
// 退出登录
router.get('/user/logout', function(req, res, next){
    req.cookies.set('userInfo', null);
    res.json(responseData);
})
// 用户评价
router.post('/comment/post', function(req, res){
    // 内容的id
    var contentId = req.body.contentid || "";
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };
    // 查询当前这条内容的信息
    Content.findOne({
        _id: contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.message = "评论成功";
        responseData.data = newContent;
        res.json(responseData);
    })
})
// 获取用户已评价信息
router.post('/comment/past', function(req, res){
    var contentId = req.body.contentid || "";
    // Content.where({_id:contentId}).count().then(function(content){
    //     console.log(content);
    // })
    Content.findOne({
        _id: contentId
    }).then(function(conts){
        // console.log(content.comments);\
        responseData.data = conts.comments;
        res.json(responseData);
    })
})

module.exports = router;