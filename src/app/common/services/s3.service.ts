declare const require: any;
require('aws-sdk/dist/aws-sdk');
import { environment  } from './../../../environments/environment';

let awsSecretAccessKey = environment.aws_secret_access_key
let awsAccessKeyId = environment.aws_access_key_id
let awsRegion = environment.aws_region
let filesS3Bucket = environment.aws_files_s3_bucket

export class AWSService {
 
  AWSService: any;
  bucket: any;
  
  constructor() { 
    this.AWSService = (<any>window).AWS;
    this.AWSService.config = {
     
      "accessKeyId": awsAccessKeyId,
      "secretAccessKey": awsSecretAccessKey,
      "region": awsRegion
    }
    this.bucket = new this.AWSService.S3({params: {Bucket: filesS3Bucket}});
  }

  s3Upload(file: any) {
    if(typeof(file) === "string"){
      return;
    }
    let fileName = new Date();
    var params = {Key: this.makeid() + file.name, ContentType: file.type, Body: file, ACL: "public-read", CacheControl: 'no-cache'};
    return new Promise((resolve, reject)=> {
      this.bucket.upload(params, function (err: any, data: any) {
        if (err) {
          return reject(new Error(err));
        } else {
          return resolve(data.Location);
        }
      });
    });   
  }
  
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

}