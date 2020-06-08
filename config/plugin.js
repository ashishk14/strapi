module.exports = ({ env }) => ({
  email: {
    provider: "nodemailer",
    providerOptions: {
      nodemailer_default_from: env('EMAIL_NODEMAILER_DEFAULT_FROM'),
      nodemailer_default_replyto: env('EMAIL_NODEMAILER_DEFAULT_REPLYTO'),
      host: env('EMAIL_HOST'),
      port: env.int('EMAIL_PORT', 25),
      secure: true,
      password: env('EMAIL_PASSWORD'),
      username: env('EMAIL_USERNAME'),
      authMethod: "SMTP",
    }
  },
});
