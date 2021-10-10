/**
 * Created by sunquan on 2021/08/31.
 */
var MongoClient = require("mongodb").MongoClient;
var Url = "mongodb://localhost:27017/";

/**
 * Nodejs操作数据库的各种方法封装
 * @param Collection 要操作的表名
 * @param Type 要操作的类型，比如增删改查直接操作库
 * @param data 如果是只有一个参数，则直接传递该参数；如果有两个参数，传递数组
 * @param CallBack 操作成功的回调函数
 * @constructor
 */
function Mongo(Collection,Type, data, CallBack) {
  MongoClient.connect(Url, function (err, db) {
    var DB = db.db("snake");
    
    switch (Type) {
      case 'Insert':
        DB.collection(Collection).insertOne(data, function (err, res) {
          if(err) throw err;
          db.close();
          CallBack(res);
        });
        break;

      case 'Delete':
        DB.collection(Collection).deleteOne(data,function (err,res) {
          if(err) throw err;
          db.close();
          CallBack(res);
        });
        break;

      case 'Read':
        DB.collection(Collection).find(data).toArray(function (err, res) {
          if(err) throw err;
          db.close();
          CallBack(res);
        });
        break;

      case 'Update':
        DB.collection(Collection).updateOne(data[0],data[1],function (err,res) {
          if(err) throw  err;
          db.close();
          CallBack(res);
        })
        break;

      case 'GetNum':
        DB.collection(Collection).find(data).toArray(function (err, res) {
          if(err) throw err;
          db.close();
          CallBack(res.length);
        });
        break;

      case 'ReadByOrder':
        if(data[2]){
          DB.collection(Collection).find(data[0]).sort(data[1]).skip(data[2].Skip).limit(data[2].Limit).toArray(function (err, res) {
            if(err) throw err;
            db.close();
            CallBack(res);
          });
        }else {
          DB.collection(Collection).find(data[0]).sort(data[1]).toArray(function (err, res) {
            if(err) throw err;
            db.close();
            CallBack(res);
          });
        }
        break;

      case 'MulDelete':
        DB.collection(Collection).remove(data,function (err,res) {
          if(err) throw err;
          db.close();
          CallBack(res);
        });
        break;
    }
  });
}

exports.Mongo = Mongo;