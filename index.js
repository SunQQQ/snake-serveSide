/**
 * author: sunquan
 * 本文件实现贪吃蛇游戏的接口
 */
var express = require('express');

var Token = require('./token');
var Monge = require('./Mongo');
var ObjectId = require('mongodb').ObjectId;
var Path = require("path");
var Formidable = require("formidable");
var FS = require('fs');
var App = express();
var cors = require('cors');
var BodyParse = require('body-parser');

App.use(cors());
App.use(BodyParse.json());
App.use(BodyParse.urlencoded({extended: true}));

/*
根据路由参数判断是前端、后端接口
如果是前端接口，接收参数，执行操作数据库的方法
如何是后端接口，接收参数，判断token，执行操作数据库方法

如果不需要验证就用foreend，如果需要验证就用backend
*/
var DealPara = function (Request, Response, OperationResponse) {
  if (Request.params.accesstype == 'foreend') {
    // 前端有时也要传递过来参数
    GetPara(Request, Response, OperationResponse);
  } else if (Request.params.accesstype == 'backend') {
    // 后端肯定要接收参数，token是肯定要接收的
    GetParaCheckToken(Request, Response, OperationResponse);
  }
}

// 获取传递的参数
var GetPara = function (Request, Response, OperationResponse) {
  var Para = Request.body;

  if (JSON.stringify(Para) == '{}') {
    OperationResponse();
  } else {
    OperationResponse(Para);
  }
}

// 获取传递的参数、并验证token
var GetParaCheckToken = function (Request, Response, OperationResponse) {
  var Para = Request.body;

  if (Para.Token && Token.token.checkToken(Para.Token) == true) {
    OperationResponse(Para);
  } else if (Para.Token && Token.token.checkToken(Para.Token) == 'TimeOut') {
    var Json = {status: '1', data: {message: '令牌超时'}};
    Response.json(Json);
  } else if (Para.Token && Token.token.checkToken(Para.Token) == false) {
    var Json = {status: '1', data: {message: '令牌有误'}};
    Response.json(Json);
  } else if (!Para.Token) {
    var Json = {status: '1', data: {message: '无Token，请登录'}};
    Response.json(Json);
  } else {
    var Json = {status: '1', data: {message: 'nothing'}};
    Response.json(Json);
  }
}

// 留言页面相关
App.post('/ScoreCreate/:accesstype', function (Request, Response) {
  DealPara(Request, Response, function (Para) {
    Monge.Mongo('score', 'Insert', Para, function () {
      var Json = {status: '0', data: '插入成功'};
      Response.json(Json);
    });
  });
});

App.post('/ScoreRead/:accesstype', function (Request, Response) {
  DealPara(Request, Response, function (Para) {
    Monge.Mongo('score', 'Read', {}, function (Result) {
      var Json = {status: '0', data: Result};
      Response.json(Json);
    });
  });
});

var server = App.listen(79, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node执行地址 http://%s:%s", host, port);

});
// 静态资源路径
App.use(express.static('Public'));