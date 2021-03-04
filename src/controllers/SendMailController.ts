import { Request,Response } from "express";
import { getCustomRepository} from "typeorm";
import {UsersRepository} from '../repositories/UsersRepository';
import {SurveysRepository} from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailSarvice from "../services/sendMailSarvice";
import {resolve} from 'path';
import { AppError } from "../errors/AppError";

class SendMailController
{
  async execute(request:Request,response:Response)
  {
    const {email,survey_id} = request.body;
    const usersRepository= getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    
    const user = await usersRepository.findOne({email});

    if(!user)
    {
      throw new AppError("user nao existe"); 
      
    }
    const survey = await surveysRepository.findOne({id:survey_id})
   
     if(!survey)
     {
      throw new AppError("usar nao fez comentario"); 
     }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where:{user_id:user.id, value:null},
     relations:["user","survey"]
    });

    const variables ={
      name:user.name,
      title:survey.title,
      description:survey.description,
      id:"",
      link:process.env.URL_MAIL,
  }
    const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs")


    if(surveyUserAlreadyExists)
    {
       variables.id = surveyUserAlreadyExists.id;
       await SendMailSarvice.execute(email,survey.title,variables,npsPath)
      return response.json(surveyUserAlreadyExists)
      }
     const surveyUser = surveysUsersRepository.create(
         {
          user_id:user.id,
          survey_id,
         })

         await surveysUsersRepository.save(surveyUser)
              variables.id = surveyUser.id;
         await SendMailSarvice.execute(email,survey.title,variables,npsPath);
       
         return response.json(surveyUser);
 }
}
export {SendMailController}