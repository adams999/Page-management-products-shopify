import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class StadisticsService {
  url = "web/stadistics-player/";

  constructor(private http: HttpClient) {}

  getPlayStadistics(data: {
    initialDate: String;
    finalDate: String;
    streamId: String;
  }) {
    return this.http.post(`${this.url}get-play-stadistics/`, data);
  }

  getStadisticsBetweenDates(data: {
    initialDate: String;
    finalDate: String;
    streamId: String;
  }) {
    return this.http.post(`${this.url}get-stadistics-between`, data);
  }

  getinfoStadisticStream(data: {
    initialDate: String;
    finalDate: String;
    streamId: String;
  }){
    return this.http.post(`${this.url}get-stadistic-stream-data`, data);
  }

  getStadisticsProduct(data: {
    initialDate: String;
    finalDate: String;
    streamId: String;
  }){
    return this.http.post(`${this.url}get-info-stadistic-products`, data);
  }
}
