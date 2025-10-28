import { StadisticsService } from "./../../common/services/stadistics.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StreamService } from "src/app/common/services/stream.service";
import * as moment from "moment";
@Component({
  selector: "app-stadistics",
  templateUrl: "./stadistics.component.html",
  styleUrls: ["./stadistics.component.scss"],
})
export class StadisticsComponent implements OnInit {
  sub: any = "";
  streamId: String = "";
  finalDate: any = "";
  initialDate: any = "";
  stream = {
    name: "",
  };
  dayFilterOptions = [
    { value: 7, text: "Last 7 Days" },
    { value: 14, text: "Last 14 Days" },
    { value: 30, text: "Last 30 Days" },
    { value: 90, text: "Last 90 Days" },
  ];

  dayFilter: {
    value: number;
    text: string;
  };

  infoStadisticStream = [
    {
      label: "Whatch Time (hours):",
      text: 10,
    },
    {
      label: "Average View Duration (min) :",
      text: 5,
    },
    {
      label: "Average Completion Rate (min) :",
      text: 4,
    },
    {
      label: "Whatch Time (hours):",
      text: 10,
    },
    {
      label: "Average View Duration (min) :",
      text: 5,
    },
    {
      label: "Average Completion Rate (min) :",
      text: 4,
    },
    {
      label: "Whatch Time (hours):",
      text: 10,
    },
    {
      label: "Average View Duration (min) :",
      text: 5,
    },
    {
      label: "Average Completion Rate (min) :",
      text: 4,
    },
  ];

  doughnutChart: any = [];

  lineChart = {
    data: [30, 40, 100, 50, 5, 10],
    labels: ["2021/08/30","2021/08/31","2021/09/01","2021/09/02","2021/09/02","2021/09/03"],
    label: "Data Static: Views Charts",
  };

  productStadistics = [
    {
    urlImg:"https://cdn.shopify.com/s/files/1/0571/7816/1341/products/pexels-photo-90946.jpg?v=1623270930",
    name:"Card Title",
    id:"fsdghfdvf",
    productInformation:[
      {
        label:"Add to Cart: ",
        text:10,
        symbol:"%"
      },
      {
        label:"Removed to Cart: ",
        text:5,
        symbol:"%"
      },
      {
        label:"Ammount Payment: ",
        text:123,
        symbol:"$"
      },
      {
        label:"Quantily Payment : ",
        text:100
      },
      {
        label: "Views Products:",
        text: 200
      }
    ]
  },
  {
    urlImg:"https://cdn.shopify.com/s/files/1/0571/7816/1341/products/pexels-photo-90946.jpg?v=1623270930",
    name:"Card Title 2",
    id:"fsdghfdvf",
    productInformation:[
      {
        label:"Add to Cart: ",
        text:10,
        symbol:"%"
      },
      {
        label:"Removed to Cart: ",
        text:5,
        symbol:"%"
      },
      {
        label:"Ammount Payment: ",
        text:123,
        symbol:"$"
      },
      {
        label:"Quantily Payment : ",
        text:100
      },
      {
        label: "Views Products:",
        text: 200
      }
    ]
  }
]
 loader:boolean = true;
 loaderProduct:boolean = true;

  constructor(
    public route: ActivatedRoute,
    public streamService: StreamService,
    public stadisticsService: StadisticsService
  ) {}

  ngOnInit() {
    /**
     * @Author: andersson arellano
     * @Date: 2021-09-03 02:23:35
     * @Desc: GET PARAM
     */
    this.sub = this.route.params.subscribe((params) => {
      this.streamId = params["id"];
    });
    this.applyFilterDay(1);
    /**
     * @Author: andersson arellano
     * @Date: 2021-09-03 02:23:52
     * @Desc: GET STREAM
     */
    this.streamService.getStreamById(this.streamId).subscribe((result: any) => {
      this.stream = result.body.stream;
    });
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-09-03 02:24:26
   * @Desc: select and filter days
   * @param {index:numer} index position in vector options
   */
  applyFilterDay(index: number) {
    this.dayFilter = this.dayFilterOptions[index];
    let date = new Date();
    this.finalDate = date.toISOString();
    this.initialDate =
      new Date(
        date.setDate(date.getDate() - this.dayFilter.value)
      ).toISOString();
    this.getPlayStadistics();
    this.getInfoStadisticStream();
    this.getStadisticsProduct();

    console.log(this.doughnutChart);
  }

  getPlayStadistics() {
    this.stadisticsService
      .getPlayStadistics({
        initialDate: this.initialDate,
        finalDate: this.finalDate,
        streamId: this.streamId,
      })
      .subscribe((data: any) => {
        console.log(data.body.data);
        // can be improved
        this.orderDatadoughnut(data.body.data,["playInitialVideo","playVideo", "pauseVideo"],"Clicks Video");
        this.orderDatadoughnut(data.body.data,["openCart","closeCart","closeWrapperProducts"],"Clicks Cart");
        this.orderDatadoughnut(data.body.data,["share","purchase", "purchaseButtonPayment"],"Clicks purchase and share");
        //this.doughnutChart = data.body.data;
      });
  }

  getInfoStadisticStream(){
    this.stadisticsService
      .getinfoStadisticStream({
        initialDate: this.initialDate,
        finalDate: this.finalDate,
        streamId: this.streamId,
      })
      .subscribe((data: any) => {
        console.log(data.body.data)
        if(data.body.data){
          this.loader = false;
          this.infoStadisticStream = data.body.data;
        }
      });
  }

  getStadisticsProduct(){
    this.stadisticsService
      .getStadisticsProduct({
        initialDate: this.initialDate,
        finalDate: this.finalDate,
        streamId: this.streamId,
      })
      .subscribe((data: any) => {
        console.log(data.body.data);
        let products = data.body.data.products[0].products;
        //filter unique products
        let productUnique =  products.filter((el, index) => {
          return products.findIndex(element => element.product === el.product) === index && el.type === "product"
        });
        //console.log(productUnique);
        /**
         * @Author: andersson arellano
         * @Date: 2021-09-06 22:07:09
         * @Desc: accommodating product data
         */
        productUnique.forEach(product => {
          let productInformation =[];
          data.body.data.typesEvents.forEach(element => {
           element.data.forEach(data =>{
             //console.log("data",data);
              if(data._id === product.product){
                product.urlImg = data.urlImg[0];
                product.name = data.name;
                productInformation.push(data);
              }
            });
            product.productInformation = productInformation;
          });
        });
        console.log("productUnique",productUnique);
        this.productStadistics = productUnique;
        this.loaderProduct = false;
      });
  }

  orderDatadoughnut(data:any,items:any[], title:String){
    let dataAut:any = [];
    let labelAut:any = [];
    items.forEach(value=>{
      for (let i = 0; i < data.data.length; i++) {
        if(value === data.labels[i]){
          dataAut.push(data.data[i]);
          labelAut.push(data.labels[i]);
        }
      }
    })
    if(dataAut.length > 0){
      this.doughnutChart.push({
        data:dataAut, labels:labelAut, title
      });
    }

  }

}
