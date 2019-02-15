
import { Injectable, ViewChild } from '@angular/core';
import{Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { DatabaseProvider } from '../database/database';
import { List } from 'linqts';
import { Chart } from 'chart.js';
import { NavController } from 'ionic-angular';
@Injectable()
export class LocalDataReaderProvider {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  

data:any=[];
result:string="";
d:any;
barChart: any;
doughnutChart: any;
lineChart: any;
  constructor(public http: Http,public datbaseProvider:DatabaseProvider) {
    console.log('Hello LocalDataReaderProvider Provider');
  }


  getLocalData(){
    let datas:any=[];
    let getrowfromstring:any =[];
    
     this.http.get('../../assets/chat/chat.txt').map(res=>res.text()).subscribe(data=>{
       getrowfromstring= data.split('\n');
    });
 
    getrowfromstring.forEach(element => {      
      let getdatefromrow = element.split('-');     
      if(getdatefromrow[1]!==undefined){
        let splituser_msg = getdatefromrow[1].split(':');          
let db ={date: getdatefromrow[0],user:splituser_msg[0],message:splituser_msg[1]};
        datas.push(db);
      } 
     
    });
    
    let db:any=datas.filter(x=> x.message!==undefined);
    //console.table(db);
        //console.table(datas);
        return db;
  }
  


   getRemoteData(){
    this.http.get('https://www.reddit.com/r/gif/top/.json?limit=10&short=hot',).map(res=>res.json()).subscribe(data=>{
      console.log(data);
    });
  }
  getmessagecount=(db:any)=>{   
  let groups=new List<group>(db);
  
  //let users=groups.Select(x=> x.user).Distinct().ToArray();
  let msgcount=groups.Select(x=> x.message).Count();
  console.log(`total count of message in group ${msgcount}`);  


/** print chart Data  */

/** print chart data end  */
  }
  getusercount=(db:any)=>{
    let groups=new List<group>(db);
    let count = groups.Select(x=> x.user).Distinct().Count();
    console.log('total Users in a group'+count);
    return count;
  }
counttotalmsgbyuser=(db:any)=>{
  
  let groups=new List<group>(db);
  let msgflow:any=groups.GroupBy(y=>y.user,x=>x.message);
  let data:any=this.generategroupchartdata(msgflow);
  return data ;
}
  /** print chart data end  */

generategroupchartdata(db:any){
 
  let Groupcircle:any=[];
  for (var key in db) {
    if (db.hasOwnProperty(key)) {
      var s='';
      for(let ss in db[key]){
      s+=db[key][ss];
      }
      let info={Users:key,TotalMessage:db[key].length,Messages:s}
      Groupcircle.push(info);
  }
 
}
console.table(Groupcircle);
return Groupcircle;
}


/** print chart data end  */






}

interface group{
  date :string,
  user:string,
  message:string
}
