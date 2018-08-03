var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
// 公用数据
router.use(function(req, res, next){
    data = {
        userInfo: req.userInfo,
        categoryies: []
    }
    Category.find().then(function(category){
        data.categoryies = category;
        next();
    })
})
// 博客首页
// 从数据库读取所有的用户数据
// limit(Number):限制获取数据条数
// skip(Number):忽略数据的条数
// sort()排序（1：正序，-1倒序）
// where()查询条件
router.get('/', function(req, res, next){
    // 查询条件
    var where = {};
    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.count = 0;
    data.limit = 2;
    data.pages = 0;
    if(data.category){
        where.category = data.category;
    }
    Content.where(where).count().then(function(count){
        data.count = count;
         // 计算总页数
        data.pages = Math.ceil(data.count/data.limit);
         // 取值不能超过总页数
        data.page = Math.min(data.page, data.pages);
         // 取值不能小于1
        data.page = Math.max(data.page, 1);
         // 忽略的条数
        var skip = (data.page-1)*data.limit;

        return Content.find().where(where).sort({addTime: -1}).limit(data.limit).skip(skip).populate(['category','user']);
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index', data);
    })
})
// 阅读全文
router.get('/view', function(req, res){

    var contentid = req.query.contentid || '';

    Content.findOne({
        _id: contentid

    }).then(function(content){
        data.content = content;
        
        content.views++;
        content.save();
        
        res.render('main/view', data);
    })
})

module.exports = router;