import {Request,Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController
{
 async create(request:Request,response:Response)
 {
  const {name,email} = request.body;
 
   const schema = yup.object().shape({
       name:yup.string().required(),
       email:yup.string().email().required()
   });

//   validacao dos campos do body com if
//   if(!(await schema.isValid(request.body)))
//   {
//       return response.status(400).json({error:"validation failed"})
//   }

//   validacao dos campos do body com try/catch
try
{
    await schema.isValid(request.body,{abortEarly:false});
}
catch(err)
{
    throw new AppError(err); 
}

  const usersRepository = getCustomRepository(UsersRepository);

  const userAlreadyExists = await usersRepository.findOne({email})

  if(userAlreadyExists)
  {
    throw new AppError("usuario ainda nao existe"); 
  }
  
  const user =usersRepository.create(
      {
          name,email
      })

      await usersRepository.save(user);
  return response.status(201).json(user);
 }
}
export {UserController};