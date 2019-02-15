import { Http } from '@angular/http';
import { List } from 'linqts';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ModalController, Item, LoadingController } from 'ionic-angular';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { DatabaseProvider } from '../../providers/database/database';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { CordovaInstance } from '@ionic-native/core';
import { AboutPage } from '../about/about';
// import { e } from '@angular/core/src/render3';
@IonicPage()
@Component({
  selector: 'page-requiredinfo',
  templateUrl: 'requiredinfo.html',
})
export class RequiredinfoPage {
  Buffer:any;
  item:any;
  title:any='';
  ginfo:any=[];
  loading: any;
  datewisedata:any=[];
 db1:any=[];
 db2:any=[];
 appChatdata:any;
  info = {
    title: 'Chat Info',
    usemsg: '',
    group: [],
    groupcreatedday:'',
    userlist: [],
    mostmessager:{},
    leastmesseager:{},
    usermsgcount: [],
    totalmsg: '',
    totaluser: '',
    mostmessagerOfday:{},
    totalletter:'',
    totalwords:'',
    mediacount:0,
    usermedia:'',
    mostmediabyuser:'',
    mostmsgdate:'',
    leastmsgdate:'',
    datewisemsgcount:[],
    datewiseusermessage:[],
    mostwordused:[]
  }



  pdfObj = null;

  constructor(public loadingController:LoadingController, public  modalCtrl: ModalController,public viewCtrl: ViewController,public socialSharing:SocialSharing, public plt: Platform, public file: File, public fileOpener: FileOpener,public databaseprovider:DatabaseProvider,public http: Http, public navCtrl: NavController, public navParams: NavParams) {
     //this.getLocalData();

  }

  ionViewDidLoad() {
//     console.log('ionViewDidLoad RequiredinfoPage');
     this.appChatdata=this.navParams.get('data');
this.info.title=this.navParams.get('ctitle');
console.log(this.title  + ' : ** Required Info Title **')
     if(this.appChatdata!=undefined){
    //console.log(">>>>>>",this.appChatdata)
    var reader = new FileReader();
    reader.onload = ()=> {
      //  console.log("blob Textttt",reader.result);
        this.getLocalData(reader.result)
    }
    reader.readAsText(this.appChatdata);
  }

  }



  getLocalData(data) {
    // this.http.get('../../assets/chat/chat.txt').map(res => res.text()).subscribe(data => {
      this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
      this.loading.present();
      let datas: any = [];

      let getrowfromstring: any = data.split('\n');

      getrowfromstring.forEach(element => {
        let getdatefromrow = element.split('-');
        let dateflow=getdatefromrow[0].split(',');
        if (getdatefromrow[1] !== undefined) {
          let splituser_msg = getdatefromrow[1].split(':');
          let db = { date: getdatefromrow[0], user: splituser_msg[0], message: splituser_msg[1] };

         // this.loading.dismiss();
          let dbdate= { date: dateflow[0],time:dateflow[1], user: splituser_msg[0], message: splituser_msg[1] };
          this.datewisedata.push(dbdate);
          datas.push(db);
        }

      });

      //filter and save all data here
       let db = datas.filter(x => x.message !== undefined);

      //fetch data  from sqllite
      this.datewisedata= this.datewisedata.filter(x => x.message !== undefined)
   //   console.table(this.datewisedata);
      // console.table(db);
      this.info.group = db;
      let leastdate= new List<any>(db).OrderBy(x=>x.date).First();
      // console.table(leastdate);
      var date1 = new Date(leastdate.date);
var date2 = new Date();
var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))+1;
this.info.groupcreatedday=diffDays.toString();
this.getmessagecount(db);

this.loading.dismiss();
    // });
  }
  getmessagecount = (db: any) => {

    let groups = new List<group>(db);
    let groupsdate = new List<group>( this.datewisedata);
    //  this.datewisedata
    let userlist:any = groups.Select(x => x.user).Distinct().ToArray();
    this.info.userlist=userlist;
    let count = groups.Select(x => x.user).Distinct().Count();
    let users = groups.Select(x => x.user).Distinct().ToArray();
    let msgcount = groups.Select(x => x.message).Count();
    this.info.totaluser = `Total user in group ${count}`;
    this.info.totalmsg = `Total  messages are ${msgcount} `;
    // console.log(`total count of message in group ${msgcount}`);

    let msgflow: any = groups.GroupBy(y => y.user, x => x.message);
    let msgflowbydate: any = groupsdate.GroupBy(y => y.date, x => x.message);
    let msgflowbydateuser: any = groupsdate.GroupBy(y => y.date,x=>x);
console.table(msgflowbydate);
    /** print chart Data  */
    this.generategroupchartdata(msgflow);
    this.generategroupchartdatabydate(msgflowbydate);
    this.generateuserdatabydate(msgflowbydateuser);
    /** print chart data end  */
  }
  removeWord = (a:any,searchWord)=>{
    var str = a;
    var n = str.search(searchWord);
    while(str.search(searchWord) > -1){
        n = str.search(searchWord);
        str = str.substring(0, n) + str.substring(n + searchWord.length, str.length);
    }
    return str;
}
  generategroupchartdata(db: any) {
    let Groupcircle: any = [];
    let Groupcirclemedia :any=[];
    let stringlength:any='';
    let meadia:any=0;
    for (var key in db) {
      if (db.hasOwnProperty(key)) {
        var s = '';
        for (let ss in db[key]) {
          s += db[key][ss];
         meadia= s.split( new RegExp( "<Media omitted>", "gi" ) ).length-1;
          stringlength+=db[key][ss];
        }
        let info = { user: key, totalmsg: db[key].length, msgstring: s }
        let meadiainfo={ user: key, totalmsg: db[key].length, msgstring: meadia }
        Groupcircle.push(info);
        Groupcirclemedia.push(meadiainfo);

      }


    }
    /** Count mOst USed Word In message */
let finalstring =this.removeWord(stringlength,'<Media omitted>');//stringlength.replace(/<Media omitted>/g,' ');
this.info.mostwordused =this.nthMostCommon(finalstring,6);
this.info.mostwordused=this.info.mostwordused.filter(x=>x.word !=="");
console.table(this.info.mostwordused);
    /** Count mOst USed Word In message */
    this.info.totalletter=stringlength.length;
      this.info.totalwords=this.countWords(stringlength);
      this.info.mediacount=stringlength.split( new RegExp( "<Media omitted>", "gi" ) ).length-1;
    //  console.log('total words'+ this.info.totalwords);
        this.info.usermsgcount = Groupcircle;
        this.info.usermedia=Groupcirclemedia;
        let mostmediabyuser:any = new List<any>( Groupcirclemedia).OrderByDescending(x=>x.msgstring).First();
        this.info.mostmediabyuser=mostmediabyuser.user;
       // console.table('mostmediabyuser'+mostmediabyuser.user);
    let mostmessager = new List<any>(Groupcircle).OrderByDescending(x=>x.totalmsg).First();
    let leastmessager = new List<any>(Groupcircle).OrderByDescending(x=>x.totalmsg).Last();
    this.info.mostmessager=mostmessager;
    this.info.leastmesseager=leastmessager;


  }
  generategroupchartdatabydate(db:any){
    let Groupcircle: any = [];
    for (var key in db) {
      if (db.hasOwnProperty(key)) {
        let info = { date: key, totalmsg: db[key].length }
        Groupcircle.push(info);
      }
  }


  new List<any>(Groupcircle).OrderBy(x=>new Date(x.date.toString('dd-MMM-yyyy')));


  this.info.datewisemsgcount=Groupcircle;
 // console.table(this.info.datewisemsgcount);
  let mostmessagerdate = new List<any>(Groupcircle).OrderBy(x=>new Date(x.date.toString('dd-MMM-yyyy'))).OrderByDescending(x=>x.totalmsg).First();
  let leastmessagerdate = new List<any>(Groupcircle).OrderBy(x=>new Date(x.date.toString('dd-MMM-yyyy'))).OrderByDescending(x=>x.totalmsg).Last();
  this.info.mostmsgdate=mostmessagerdate;
 this.info.leastmsgdate=leastmessagerdate;
}
generateuserdatabydate(db:any){
  let Groupcircle: any = [];
  for (var key in db) {

    if (db.hasOwnProperty(key)) {
      let userinfodate=new List<any>(db[key]).GroupBy(y => y.user,x=>x.message);
      for (var keys in userinfodate) {
        if (userinfodate.hasOwnProperty(keys)) {
        let info = { date: key, user:keys,totalmesage:userinfodate[keys].length }
        Groupcircle.push(info);
        }
      }

    }
    this.info.datewiseusermessage=Groupcircle;
  //  console.table(Groupcircle);
}
}
  countWords=(s)=>{
    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    return s.split(' ').filter(function(str){return str!="";}).length;

}
  /** find most  common world used Begin */
  nthMostCommon(string, ammount) {
    var wordsArray = string.split(/\s/);
    var wordOccurrences = {}
    for (var i = 0; i < wordsArray.length; i++) {
      wordOccurrences['_' + wordsArray[i]] = (wordOccurrences['_' + wordsArray[i]] || 0) + 1;
    }
    var result = Object.keys(wordOccurrences).reduce(function (acc, currentKey) {
      /* you may want to include a binary search here */
      for (var i = 0; i < ammount; i++) {
        if (!acc[i]) {
          acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
          break;
        } else if (acc[i].occurences < wordOccurrences[currentKey]) {
          acc.splice(i, 0, { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] });
          if (acc.length > ammount)
            acc.pop();
          break;
        }
      }
      return acc;
    }, []);
    console.table(result);
    return result;

  }
  /** find most common world used END */
  //Accordine Open
  ngOnInit() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }
  //Accordine End


  openModal() {
    this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
    this.loading.present();
     this.databaseprovider.getAllJsonData().then((r:any)=>{
       console.log(r);
     if(r != null){
      this.loading.dismiss();
      this.ginfo.length=0;
      r.forEach(e => {
       let db={key:e.group_id,data:JSON.parse(e.groupdata)}
       this.ginfo.push(db);
      });

     }
       console.log("ginfo",this.ginfo)

     })

    }



getdatafromjsontable(){
 //// insert json data(dbarrar) in to sql lite
//  this.databaseprovider.JsonInsert('fristGroup',JSON.stringify(this.db));
console.log(this.info);
let infoClone = {
   title: this.info.title,

  groupcreatedday:this.info.groupcreatedday,
  userlist:this.info.userlist,
  mostmessager:this.info.mostmessager,
  leastmesseager:this.info.leastmesseager,
  usermsgcount:this.info.usermsgcount,
  totalmsg: this.info.totalmsg,
  totaluser:this.info.totaluser,
  mostmessagerOfday:this.info.mostmessagerOfday,
  totalletter:this.info.totalletter,
  totalwords:this.info.totalwords,
  mediacount:this.info.mediacount,
  usermedia:this.info.usermedia,
  mostmediabyuser:this.info.mostmediabyuser
}
 this.db1.push(infoClone)
//this.db1.push(this.info)
 this.databaseprovider.JsonInsert(JSON.stringify(this.db1));
 alert("Chat save sucessfully");

}

getHistory(Db){

console.log("db",Db);


this.info = {
  title: Db.data[0].title ,
  usemsg: '',
    group:[],
    groupcreatedday:Db.data[0].groupcreatedday,
    userlist: Db.data[0].userlist,
    mostmessager:Db.data[0].mostmessager,
    leastmesseager:Db.data[0].leastmesseager,
    usermsgcount:Db.data[0].usermsgcount,
    totalmsg: Db.data[0].totalmsg,
    totaluser: Db.data[0].totaluser,
    mostmessagerOfday:Db.data[0].mostmessagerOfday,
    totalletter:Db.data[0].totalletter,
    totalwords:Db.data[0].totalwords,
    mediacount:Db.data[0].mediacount,
    usermedia:Db.data[0].usermedia,
    mostmediabyuser:Db.data[0].mostmediabyuser,

    mostmsgdate:Db.data[0].mostmsgdate,
    leastmsgdate:Db.data[0].leastmsgdate,
    datewisemsgcount:Db.data[0].datewisemsgcount,
    datewiseusermessage:Db.data[0].datewiseusermessage,
    mostwordused:Db.data[0].mostwordused
}
console.log("info",this.info)
}

createPdf() {

  let infoClone2 = {
    title: this.info.title,
   groupcreatedday:this.info.groupcreatedday,
   userlist:this.info.userlist,
   mostmessager:this.info.mostmessager,
   leastmesseager:this.info.leastmesseager,
   usermsgcount:this.info.usermsgcount,
   totalmsg: this.info.totalmsg,
   totaluser:this.info.totaluser,
   mostmessagerOfday:this.info.mostmessagerOfday,
   totalletter:this.info.totalletter,
   totalwords:this.info.totalwords,
   mediacount:this.info.mediacount,
   usermedia:this.info.usermedia,
   mostmediabyuser:this.info.mostmediabyuser,

   mostmsgdate:this.info.mostmsgdate,
   leastmsgdate:this.info.leastmsgdate,
   datewisemsgcount:this.info.datewisemsgcount,
   datewiseusermessage:this.info.datewiseusermessage,
   mostwordused:this.info.mostwordused
 }
 console.log("createpdf Info",this.info)
  var docDefinition = {
    content: [
      { text: 'REMINDER', style: 'header' },
      { text: new Date().toTimeString(), alignment: 'right' },

      { text: 'GroupCreatedDay'+infoClone2.groupcreatedday },

      { text: 'userlist'+infoClone2.userlist  },

      { text: 'mostmessager' +infoClone2.mostmessager  },

      { text: 'leastmesseager'+infoClone2.leastmesseager },

      { text: 'usermsgcount' +infoClone2.usermsgcount },

      { text: 'totalmsg' +infoClone2.totalmsg },
       { text: 'totaluser'+ infoClone2.totaluser },

      { text: 'mostmessagerOfday:'+infoClone2.mostmessagerOfday },

      { text: 'totalletter;'+infoClone2.totalletter},

      { text: 'totalwords:'+infoClone2.totalwords },

      { text: 'mediacount:'+infoClone2.mediacount },

      { text: 'usermedia:'+ infoClone2.usermedia },

      { text: 'mostmediabyuser:'+infoClone2.mostmediabyuser },



      { text: 'mostmsgdate:' +infoClone2.mostmsgdate },

      { text: 'leastmsgdate:' + infoClone2.leastmsgdate  },

      { text: 'datewisemsgcount:'  +infoClone2.datewisemsgcount },

      { text: 'datewiseusermessage:'+infoClone2.datewiseusermessage },
      { text: 'mostwordused:'+infoClone2.mostwordused },

      console.log("groupcreatedday Info",infoClone2.groupcreatedday),
      console.log("mediacount Info", infoClone2.mediacount),
      console.log("mostmessager Info",infoClone2.mostmessager),
      console.log("mostmessager Info",infoClone2.mostmessager)
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 0]
      },
      story: {
        italic: true,
        alignment: 'center',
        width: '50%',
      }
    }
  }
  this.pdfObj = pdfMake.createPdf(docDefinition);
}

downloadPdf() {
  if (this.plt.is('cordova')) {
    this.pdfObj.getDataUrl((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });

      // Save the PDF to the data Directory of our App
      this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
        // Open the PDf with the correct OS tools
        alert("pdf download sucess In"+this.file.dataDirectory);
      // this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');

      })
    });
  } else {
    // On a browser simply use download!
    this.pdfObj.download();
  }
}
SharePdf(){
  // share(message, subject, file, url)
  this.pdfObj.getDataUrl((dataUrl) => {
    this.socialSharing.share(null, null, dataUrl,null).then(() => {

      console.log("Pdf  Share Success")
    }).catch((err) => {
      console.log("Pdf  Share Error",err)

    });
});

}
}



interface group {
  date: string,
  user: string,
  message: string
}


