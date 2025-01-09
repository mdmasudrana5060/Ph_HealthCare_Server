import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
  jwt_reset_pass_token: process.env.JWT_RESET_PASS_TOKEN,
  jwt_reset_pass_token_expires_in: process.env.JWT_RESET_PASS_TOKEN_EXPIRESIN,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  ssl: {
    store_id: process.env.STORE_ID,
    store_password: process.env.STORE_PASSWORD,
    success_url: process.env.SUCCESS_URL,
    fail_url: process.env.FAIL_URL,
    cancel_url: process.env.CANCEL_URL,
    ipn_url: process.env.IPN_URL,
    ssl_payment_url: process.env.SSL_PAYMENT_URL,
    ssl_validation_url: process.env.SSL_VALIDATION_URL,
  },
};
