import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VideosService {

  videos: any = {};

  constructor(private http: HttpClient) {
  }
  getVideoById(videoId) {
    let url = `web/videos/single-video/${videoId}`
    return this.http.get(url);
  }

  getVideos(accoutnId) {
    let url = `web/videos/${accoutnId}`
    return this.http.get(url);
  }

  getUpdatedVideos(accoutnId) {
    let url = `video/youtube/refresh-channel/${accoutnId}`
    return this.http.get(url);
  }
}