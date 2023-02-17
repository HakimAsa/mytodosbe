const config = require('config');
module.exports = function () {
  //db string
  if (!config.get('db')) {
    throw new Error('FATAL ERROR:db must be defined.');
  }
  // if (!config.get('jwtPrivateKey') || !config.get('jwtExpiresIn') || !config.get('jwtCookieExpire')) {
  //     throw new Error('FATAL ERROR: jwtPrivateKey, jwtExpiresIn and jwtCookieExpire must be  defined.');
  // }
  // // mailtrap credentials must be defined
  // if (!config.get('smtp_host') || !config.get('smtp_port') || !config.get('smtp_email') || !config.get('smtp_password') || !config.get('from_email') || !config.get('from_name') || !config.get('to_email')) {
  //     throw new Error('FATAL ERROR ON MAILTRAP CREDENTIALS: smtp_host, smtp_port,  smtp_email, smtp_password,from_email and from_name must be  defined.');
  // }

  // // AWS credentials check

  // if (!config.get('AWSAccessKeyId') || !config.get('AWSSecretKey') || !config.get('S3_BUCKET') || !config.get('S3_BUCKET_REGION')) {
  //     throw new Error('FATAL ERROR ON AWS S3 CREDENTIALS: AWS_ACCESS_KEY_ID,  AWS_SECRET_ACCESS_KEY, S3_BUCKET_REGION  and S3_BUCKET must be  defined.');
  // }
};
