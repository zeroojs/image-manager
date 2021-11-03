import { conf, rs, form_up, auth, zone } from 'qiniu'
import { qiniuConfig, QiniuConfig } from '../../qiniu.config'

export interface QiniuFile {
  key: string,
  hash: string,
  fsize?: number,
  mimeType?: string,
  putTime?: number,
  type?: number,
  status?: number,
  md5?: string
}

export class Qiniu {
  private bucket: string
  private readonly config: QiniuConfig = qiniuConfig

  constructor(bucket: string = 'image-manager') {
    this.bucket = bucket
    conf.ACCESS_KEY = this.config.ACCESS_KEY
    conf.SECRET_KEY = this.config.SECRET_KEY
  }

  get bucketManager(): rs.BucketManager {
    const mac = new auth.digest.Mac(...Object.values(this.config));
    const qiniuConfig: conf.Config & { zone?: conf.Zone } = new conf.Config();
    //config.useHttpsDomain = true;
    qiniuConfig.zone = zone.Zone_z2;
    const bucketManager = new rs.BucketManager(mac, qiniuConfig);
    return bucketManager
  }

  /**
   * 生成上传 token
   * @param {string} bucket 空间名称
   * @param {string} filename 上传后文件名称
   * @returns 
   */
  generateUploadToken(key: string): string {
    const putPolicy = new rs.PutPolicy({
      saveKey: key,
      scope: this.bucket,
      returnBody: '{"key":"$(key)","hash":"$(etag)","mime":$(fsize),"bucket":"$(bucket)","fname":"$(fname)"}'
    });
    return putPolicy.uploadToken();
  }

  // 上传单个文件
  uploadFile(key: string, localFile: string) {
    const token = this.generateUploadToken(key)
    const extra = new form_up.PutExtra();
    const formUploader = new form_up.FormUploader();
    return new Promise((resolve, reject) => {
      formUploader.putFile(token, key, localFile, extra, (respErr, respBody, respInfo) => {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          // console.log(respInfo.statusCode);
          // console.log(respBody);
          reject(respInfo)
        }
      })
    })
  }

  // buff 上传
  uploadBuffer(key: string, buffer: Buffer): Promise<QiniuFile> {
    const token = this.generateUploadToken(key)
    const extra = new form_up.PutExtra();
    const formUploader = new form_up.FormUploader();
    return new Promise((resolve, reject) => {
      formUploader.put(token, key, buffer, extra, (respErr, respBody, respInfo) => {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          reject(respInfo)
        }
      })
    })
  }

  // 获取已上传的文件列表
  querytFiles(limit = 10, prefix = '') {
    return new Promise((resolve, reject) => {
      this.bucketManager.listPrefix(this.bucket, { limit, prefix }, function(err, respBody, respInfo) {
        if (err) {
          throw err;
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject(respInfo)
        }
      })
    })
  }

  // 删除资源
  dropFile(key: string) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, function(err, respBody, respInfo) {
        if (err) {
          // throw err;
          reject(err)
          // { // 资源部存在
          //   status: 612,
          //   statusCode: 612,
          // }
        } 
        resolve(respInfo)
        // if (respInfo.statusCode === 200) {
        //   resolve(respInfo)
        // } else {
        //   reject(respInfo)
        // }
      })
    })
  }

  // 获取文件信息
  stat(key: string) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, function(err, respBody, respInfo) {
        if (err) {
          throw err;
        } 
        if (respInfo.statusCode === 200) {
          resolve(respBody)
        } else {
          reject(respInfo)
        }
      })
    }) 
  }
}