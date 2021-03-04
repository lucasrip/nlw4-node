import nodemailer, { Transporter } from 'nodemailer';
import {resolve} from 'path';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService 
{
    private client:Transporter
    constructor()
    {
      nodemailer.createTestAccount().then(account=>{
          const transporter= nodemailer.createTransport({
              host:account.smtp.host,
              port:account.smtp.port,
              auth:{
                  user:account.user,
                  pass:account.pass
              }
          })
          this.client = transporter;
      })
    }

    async execute(to:string,subject:string,variables:Object,path:string)
    {
    //   const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs")
      const templateFileContent = fs.readFileSync(path).toString("utf8");
      const mailTemplateParse =handlebars.compile(templateFileContent);

      const html =mailTemplateParse(variables);
      const message =await this.client.sendMail({
          to,
          subject,
          html,
          from:"NPS <noreplay@nps.com.br>"
      })
      console.log('message send %',message.messageId);
      console.log('Preview URl: %', nodemailer.getTestMessageUrl(message))
    }
}

export default new SendMailService();