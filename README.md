# 小型博客项目


## 技术框架介绍
``` bash
# 技术框架介绍
NodeJS
Express
Mongodb
```

## 第三方模块  &  中间件
``` bash
body-parser : 解析post请求数据
cookies ：读/写cookie
markdown ：markdown语法解析生成模块
mongoose ：操作mongodb数据
swig ：模板解析引擎
```
## 项目运行
``` bash
# 创建package.json文件
npm init

# 下载依赖包
npm install --save 第三方模块

# 下载mongodb数据库
https://www.mongodb.com/download-center?jmp=nav#community

# 可以下载mongodb数据库可视化工具
https://robomongo.org/campaign   (Robo) 

# 进入下载的mongodb文件中\mongodb\bin
mongod --dbpath=数据库存储目录 --port=端口号

# 启动项目
npm run start


```

## 目录结构
``` bash
db         数据库存储目录
models     数据库模型文件目录
node_modules    node第三方模块目录
public          公共文件目录(css, js ,image.....)
routers			路由文件目录
	--admin     	后台管理模块
		/				首页
		用户管理
		/user			用户列表
		分类管理
		/category		分类列表
		/category/add	分类添加
		/category/edit	分类修改
		/category/delete分类删除
		文章内容管理
		/article 		内容列表
		/article/add	内容添加
		/article/edit	内容修改
		/article/delete	内容删除
		评论内容管理
		/comment		评论列表
		/comment/delete	评论删除
	--api       	api模块
		/				首页
		/register		用户注册
		/login			用户登录
		/comment		评论获取
		/comment/post	评论提交
	--/         	前台模块
		/       		首页
		/view			内容页
schemas			数据库结构文件(schema)目录
views			模板试图文件目录
app.js 			应用(启动)入口文件
package.json 	配置文件
```