//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
@Injectable()
export class DatabaseProvider {
public dbObject:SQLiteObject;
//private isOpen:boolean;

constructor( public sqlite: SQLite , public platform: Platform)
{
  this.createDatabase();


  }
  createDatabase(){

   this. platform.ready().then(() => {
      console.log('Platform ready for db service now');
      this.sqlite.create({
          name: 'ChatAnalyzer.db',
          location: 'default'
      }).then((db: SQLiteObject) => {
          this.dbObject = db;
          this.dbObject.open().then(_ => {

              this.Group();
              this.CreateJson();
          })
      }).catch(err=>{
        console.log("Already Created Database",err);

      })
  })
  }

  CreateJson() {
    this.dbObject.executeSql('CREATE TABLE IF NOT EXISTS groupjson(  group_id INTEGER PRIMARY KEY AUTOINCREMENT,  groupdata Text)', [])
        .then(res => console.log('CreateJson'))
        .catch(e => console.log(e))
  }
  JsonInsert(groupdata: any){
    this.sqlite.create({
      name: 'ChatAnalyzer.db',
      location: 'default'
  }).then((db: SQLiteObject) => {
      this.dbObject = db;
      // this.dbObject.open().then(_ =>
        return db.executeSql('Insert or replace into groupjson(groupdata) values(?)', [groupdata]).then(inserted=>{
      console.log("Inserted",inserted);

        }).catch(err=>{
          console.log("Errr",err);
        })

      // })
  }).catch(err=>{
    console.log("error",err);

  })

  }

  getAllJsonData() {

    return new Promise((resolve, reject)=> {


      this.dbObject.executeSql("SELECT * FROM groupjson", []).then((data) => {
        let developers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
         // console.log("mydata",data.rows.item(i));

            developers.push(data.rows.item(i));
          }
        }
        return resolve(developers);
      }, err => {
        console.log('Error: ', err);
        reject(err)
        // return [];
      });

    });


  }




Group() {
  this.dbObject.executeSql('CREATE TABLE IF NOT EXISTS group_info1(  group_id INTEGER PRIMARY KEY AUTOINCREMENT,date Text ,  user Text,  message Text)', [])
      .then(res => console.log('Created GroupInfoTable'))
      .catch(e => console.log(e))
}
GroupInsert(date:any,user:any,message: any){
  this.sqlite.create({
    name: 'ChatAnalyzer.db',
    location: 'default'
}).then((db: SQLiteObject) => {
    this.dbObject = db;
    // this.dbObject.open().then(_ =>
      return db.executeSql('Insert or replace into group_info1(date,user,message) values(?,?,?)', [date,user,message]).then(inserted=>{
       // console.log("Inserted",inserted);

      }).catch(err=>{
        console.log("Errr",err);
      })

    // })
}).catch(err=>{
  console.log("error",err);

})

}
getAllDevelopers() {

  return new Promise((resolve, reject)=> {


    this.dbObject.executeSql("SELECT * FROM group_info1", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        // console.log("mydata",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}

TotalMessageCount() {

  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql("SELECT count(message)as TotalMessage FROM  group_info1", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
         //console.log("TotalMessage",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}

TotalGroupMember() {

  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql("SELECT count(DISTINCT user)as TotalMessage FROM  group_info1", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
       //  console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}


// TotalDaysGroupCreation(): Promise<any> {
//   return this.dbObject.executeSql('SELECT DATEDIFF( NOW(),createat) AS GroupCreation FROM group_info', []);
// }
TotalDaysGroupCreation() {

  return new Promise((resolve, reject)=> {
   //SELECT (eventend - eventstart)
   //SELECT DATEDIFF( NOW(),date) AS GroupCreation FROM group_info

   //SELECT DATEDIFF( NOW(),createat) AS GroupCreation FROM whatsapp_analyzer.group_info;
    this.dbObject.executeSql("SELECT ('now' - date) FROM group_info1", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
       //  console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });

}

TotalLetterInGroup() {
  // select `user`, sum(length(message) - length(replace(message, ' ', ''))+1) as words
  // from your_table
  // group by `user`
  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql('select user as User, sum(LENGTH(message)) as totalWorld from (SELECT  gm.message ,gm.user ,LENGTH(message)  as Totalletter FROM group_info1 gm group by gm.user ) t', []).then((data) => {

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        //console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}


MessageWiseLetterCount() {

  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql(' SELECT  gm.message as Message ,gm.user as User ,LENGTH(message)  as Totalletter FROM group_info1 gm group by gm.user ', []).then((data) => {

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        //console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}

MessagePostByIndividual() {

  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql('select t.user, count(t.message) as totalmsg from group_info1 as t group  by t.user order by t.message desc ', []).then((data) => {

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        //console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}

EarlyRiser() {
  // SELECT Date_format(msg_at, '%H:%i:%s') early, msg_at, name FROM   (SELECT * FROM   group_message t WHERE  Hour(t.date) BETWEEN 5 AND 8) t ORDER  BY early ASC LIMIT  1

  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql('select date as early ,user from  (SELECT * FROM   group_info1 t WHERE  hours(t.date) BETWEEN 5 AND 8) t ORDER  BY early ASC LIMIT  1 ', []).then((data) => {

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        //console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}

 individualSendMsgInDay() {
//  select * from (select u.*, msg_by,count(msg) as totalmsg ,msg_at from  whatsapp_analyzer.group_message tinner join users u on u.id = t.msg_bywhere DATE(msg_at) =DATE(NOW()) group by t.msg_by ) t order by  t.totalmsg desc limit 1


  return new Promise((resolve, reject)=> {

    this.dbObject.executeSql('select user,count(message) as totalmsg  from group_info1 where date =DATE(NOW()) group by user order by t.totalmsg desc limit 1', []).then((data) => {

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
        //console.log("TotalUser",data.rows.item(i));

          developers.push(data.rows.item(i));
        }
      }
      return resolve(developers);
    }, err => {
      console.log('Error: ', err);
      reject(err)
      // return [];
    });

  });


}
    }






