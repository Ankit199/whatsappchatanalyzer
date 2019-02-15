import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
 import { DatabaseProvider } from '../../providers/database/database';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { LocalDataReaderProvider } from '../../providers/local-data-reader/local-data-reader';
import { Chart } from 'chart.js';
import{Http} from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;
public pieChartEl  : any;
public barChartEl : any;
public lineChartEl : any;
public chartLabels : any= [];
public chartValues : any= [];
public chartColours  : any= [];
public chartHoverColours : any = [];
public chartLoading: any;
data:any=[];
result:string="";
d:any;
barChart: any;
doughnutChart: any;
lineChart: any;
  constructor( public http:Http,public localDataReaderProvider:LocalDataReaderProvider,public filePath:FilePath ,public fileChooser:FileChooser ,public fileOpener: FileOpener,public navCtrl: NavController,public databaseprovider:DatabaseProvider) {
      this.databaseprovider.createDatabase();
  }
   // application/pdf , text/plain, image/png, image/jpeg, audio/wav etc
  chooseFile(){
this.fileChooser.open().then(file=>{
  this.filePath.resolveNativePath(file).then(resolvedFilepath=>{
    // this.fileOpener.open(resolvedFilepath,'application/pdf').then(value=>{
      this.fileOpener.open(resolvedFilepath,'text/plain').then(value=>{
        // console.log('Success');
      //alert('it worked')
    }).catch(err=>{
      alert(JSON.stringify(err));
      });
  }).catch(err=>{
  alert(JSON.stringify(err));
  })
});
  }
  getdatassss=()=>{
 
    let dbdata=[];
   dbdata = this.localDataReaderProvider.getLocalData();
   let chartdata=this.localDataReaderProvider.counttotalmsgbyuser(dbdata);
  //  console.log(chartdata);
  
  }

  getdata(){
    let datas:any=[];
    let getrowfromstring:any =[];
    
     this.http.get('../../assets/chat/chat.txt').map(res=>res.text()).subscribe(data=>{
       getrowfromstring= data.split('\n');
       getrowfromstring.forEach(element => {      
        let getdatefromrow = element.split('-');     
        if(getdatefromrow[1]!==undefined){
          let splituser_msg = getdatefromrow[1].split(':');          
          let db ={date: getdatefromrow[0],user:splituser_msg[0],message:splituser_msg[1]};
          datas.push(db);
        } 
       
      });
      
      let db:any=datas.filter(x=> x.message!==undefined);
      // console.log(db);

       for(let i =0; i<db.length;i++){
        this.databaseprovider.GroupInsert(db[i].date,db[i].user,db[i].message)
         }
          // console.table(datas);
          let chartdata=this.localDataReaderProvider.counttotalmsgbyuser(db);
          // console.table(chartdata);
          this.defineChartData(chartdata);
          // this.creatdoughnutChart();
    });
    
    
  }

// }
/** Define Chart Data  */
defineChartData(db:any)
{
   let k : any;

   for(k in db)
   {
      var tech=db[k];

      this.chartLabels.push(tech.Users);
      this.chartValues.push(tech.TotalMessage);
     // this.chartColours.push(tech.color);
     // this.chartHoverColours.push(tech.hover);
   }
  
}




fetchData(){
 let data:any= this.databaseprovider.getAllDevelopers().then((data:any)=>{
   console.log("data===",data);
 }).catch(err=>{
  console.log("Errrr===",err);
 })
  

}
TotalMessageCount(){
  let data:any= this.databaseprovider.TotalMessageCount().then((data:any)=>{
   console.log("TotalMessageCount===",data);
  }).catch(err=>{
   console.log("Errrr===",err);
  })
   
 
 }

 TotalGroupMember(){
 this.databaseprovider.TotalGroupMember().then((data:any)=>{
   console.log("TotalUser===",data);
  }).catch(err=>{
   console.log("Errrr===",err);
  })
   
 
 }
 
 TotalDaysGroupCreation(){
  this.databaseprovider.TotalDaysGroupCreation().then((data:any)=>{
    console.log("TotalDaysGroupCreation===",data);
   }).catch(err=>{
    console.log("Errrr===",err);
   })
    
  
  }
  
  TotalLetterInGroup(){
    this.databaseprovider.TotalLetterInGroup().then((data:any)=>{
      console.log("TotalLetterInGroup===",data);
     }).catch(err=>{
      console.log("Errrr===",err);
     })
      
    
    }
    MessageWiseLetterCount(){
      this.databaseprovider.MessageWiseLetterCount().then((data:any)=>{
        console.log("MessageWiseLetterCount===",data);
       }).catch(err=>{
        console.log("Errrr===",err);
       })
        
      
      }
      
      MessagePostByIndividual(){
        this.databaseprovider.MessagePostByIndividual().then((data:any)=>{
          console.log("MessagePostByIndividual===",data);
         }).catch(err=>{
          console.log("Errrr===",err);
         })
          
        
        }
        
        EarlyRiser(){
          this.databaseprovider.EarlyRiser().then((data:any)=>{
            console.log("EarlyRiser===",data);
           }).catch(err=>{
            console.log("Errrr===",err);
           })
            
          
          }
          individualSendMsgInDay(){
            this.databaseprovider.individualSendMsgInDay().then((data:any)=>{
              console.log("individualSendMsgInDay===",data);
             }).catch(err=>{
              console.log("Errrr===",err);
             })
              
            
            }
          

}
