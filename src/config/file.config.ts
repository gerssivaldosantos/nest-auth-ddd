import { registerAs } from '@nestjs/config'

export default registerAs('file', () => ({
  driver: process.env.FILE_DRIVER,
  fileLocalPath: process.env.FILE_LOCAL_PATH,
  fileLocalPathPub: process.env.FILE_LOCAL_PATH_PUB,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
  awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
  awsS3Region: process.env.AWS_S3_REGION,
  maxFileSize: process.env.MAX_FILE_SIZE || 2097152 // 2mb
}))
