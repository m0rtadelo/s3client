export interface IConfig {
  buckets: Array<IBucket>,
  version: string,
  path: string,
}

export interface IBucket {
  bucket: string,
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  localPath: string,
  remotePath: string,
  maxAsyncS3?: number,
  s3RetryCount?: number,
  s3RetryDelay?: number,
  multipartUploadThreshold?: number,
  multipartUploadSize?: number,
}
