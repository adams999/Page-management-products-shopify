import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StreamService {

  stream: any = {};

  constructor(private http: HttpClient) {
  }
  
  addStream(stream:any){
    return new Promise((resolve, reject) => {
      this.http.post('web/streams/create-stream', stream).subscribe((res: any) => {
       resolve(res);
     }, (error: any) => {
       console.log(error)
       reject(error.error);
     });
   });
  }
  getStreams(filterKey:any) {
    let url = `web/streams`
    return this.http.get(url,{params: filterKey});
  }

  getAllStreams(filterKey:any){
    let url = `web/streams/all-streams`
    return this.http.get(url,{params: filterKey});
  }

  getStreamsFilters(filterKey: any) {
    console.log("asdasda",filterKey)
    let url = `web/streams?status=${filterKey.status}&sortBy=${filterKey.sortBy}&isArchive=${filterKey.isArchive}`
    return this.http.get(url);
  }

  getStreamById(streamId:any) {
    let url = `web/streams/get-single-stream/${streamId}`
    return this.http.get(url);
  }

  deleteStreamById(streamId : any){
    let url = `web/streams/delete-stream/${streamId}`
    return this.http.delete(url);
  }
  updateStreamStatusById(stream : any){
    let url = `web/streams/update-single-stream/${stream._id}`
    return this.http.put(url, stream);
  }
  updateStreamById(stream : any){
    let url = `web/streams/update-stream/${stream._id}`
    return this.http.put(url, stream);
  }
}