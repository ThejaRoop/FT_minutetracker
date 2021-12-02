import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { StockService } from './stock-service.service';

@Component({
  selector: 'app-stock-details-listing',
  templateUrl: './stock-details-listing.component.html',
  styleUrls: ['./stock-details-listing.component.css']
})
export class StockDetailsListingComponent implements OnInit {

  queryForm;
  fromDate;
  toDate;
  timesArray = ['9:30', '9:35', '9:40'];
  datesArray = [];
  apiCalls = [];
  datePricesMapping = {};
  showTable = false;
  noOfResponsesInDay = 0;

  constructor(private fb: FormBuilder, private stockService: StockService) { }

  ngOnInit(): void {

    this.queryForm = this.fb.group({
      symbol: ['', [Validators.required]],
      fromDate: [,[Validators.required]],
      toDate: [,[Validators.required]]
    })

    this.queryForm.get('fromDate').valueChanges.subscribe(val => {

      this.fromDate = new Date(this.queryForm.get('fromDate').value);
    })

    this.queryForm.get('toDate').valueChanges.subscribe(val => {

      this.toDate = new Date(this.queryForm.get('toDate').value) 
      
    })

   
  }

  getDetails() {

    this.getDates();

  }

  

  getDates() {
    this.datesArray = [];
    
    // this.fromDate
    console.log(this.fromDate);
    this.fromDate.setHours(0);
    this.fromDate.setMinutes(0);
    this.fromDate.setSeconds(0);
    this.toDate.setHours(0);
    this.toDate.setMinutes(0);
    this.toDate.setSeconds(0);
    var calDate = this.fromDate;
    console.log(this.fromDate);
    if(this.fromDate.getDay() != 0 && this.fromDate.getDay() != 6) {
      this.datesArray.push(this.fromDate);
    }
    
    while(calDate <= this.toDate) {
      calDate = new Date(calDate.getTime() + 24 * 60 * 60 * 1000);
      if(calDate.getDay() != 0 && calDate.getDay() != 6) {
      this.datesArray.push(calDate);
      }
    }

    for(let i=0;i<this.datesArray.length;i++) {
     // console.log(this.datesArray[i]);
    }

    this.makeAPICalls();
  }

  makeAPICalls() {
    this.datePricesMapping = {};
    this.apiCalls = [];
    this.noOfResponsesInDay = 0;

    this.datesArray.forEach(date => {
      let start, end, s, e;
      start = date;
      start.setHours(9);
    start.setMinutes(25);
    start.setSeconds(0);
    s = start.getTime()/1000;
    end = date;
    end.setHours(16);
    end.setMinutes(0);
    end.setSeconds(0);
    e = end.getTime()/1000;
      this.apiCalls.push(this.stockService.getStockDetails(this.queryForm.get('symbol').value, s, e));
    })

    Promise.all(this.apiCalls).then((result) => {
      result.forEach((res, i) => {
        this.datePricesMapping[i] = res;
      })

      console.log(this.datePricesMapping);
      this.noOfResponsesInDay = this.datePricesMapping[0]['c'].length - 1;
      this.showTable = true;
     
    })

  }

  calculateTime (time) {
    let unix_timestamp = time; 
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

return formattedTime;
  }

  calcBusinessDays(dDate1, dDate2) { 
    var iWeeks, iDateDiff, iAdjust = 0;
    if (dDate2 < dDate1) return -1; 
    var iWeekday1 = dDate1.getDay(); 
    var iWeekday2 = dDate2.getDay();
    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; 
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; 
    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; 
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;
  
    
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)
  
    if (iWeekday1 < iWeekday2) { 
      iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
      iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }
  
    iDateDiff -= iAdjust 
  
    return (iDateDiff + 1); 
  }

  ngAfterViewInit() {
   // this.convertToXLSX(); 
  }

  convertToXLSX() {
    let line = '';
    var a = {"c":[323.2,320.79,319,300.61,304.21],"h":[323.41,323.28,322.39,312.15,309.08],"l":[319.63,319.36,318.22,300.01,298.6],"o":[320.22,320.3,321.42,311.46,308.24],"s":"ok","t":[1591623000,1591709400,1591795800,1591882200,1591968600],"v":[73641200,77479200,95000800,209243600,194529100]};
    for(let i=0; i < a.c.length; i++) {
      line +=this.convertUNIXToDate(a.t[i])+','+a.v[i] + '\r\n';
    }
    document.getElementById('display').textContent = line;
  }


  convertUNIXToDate(ts) {
    

var ts_ms = ts * 1000;

var date_ob = new Date(ts_ms);

var year = date_ob.getFullYear();

var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

var date = ("0" + date_ob.getDate()).slice(-2);




return (year + "-" + month + "-" + date)
  }

  convertDateFormat(date_ob) {
    var year = date_ob.getFullYear();

var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

var date = ("0" + date_ob.getDate()).slice(-2);




return (year + "-" + month + "-" + date)

  }

}


// a='2020/06/15'
// "2020/06/15"
// new Date(a)
// Mon Jun 15 2020 00:00:00 GMT+0530 (India Standard Time)
// b = '2020/06/25'
// "2020/06/25"
// f = new Date(a)
// Mon Jun 15 2020 00:00:00 GMT+0530 (India Standard Time)
// f+1
// "Mon Jun 15 2020 00:00:00 GMT+0530 (India Standard Time)1"
// f+2
// "Mon Jun 15 2020 00:00:00 GMT+0530 (India Standard Time)2"
// f
// Mon Jun 15 2020 00:00:00 GMT+0530 (India Standard Time)
// var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// undefined
// currentDate
// Sat Jun 13 2020 11:32:18 GMT+0530 (India Standard Time)
// var date = new Date(1591623900 * 1000);

//https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=60&from=1591966800&to=1591995600&token=brg4p17rh5rc8dj2rtj0
