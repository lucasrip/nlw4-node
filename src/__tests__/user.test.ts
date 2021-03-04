import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

afterAll(async()=>{
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.close();
})

describe("Users",()=>{
    
    beforeAll(async()=>{
    const Connection = await createConnection();
    await Connection.runMigrations();
    });

     it('criar novo usuario', async ()=>{
        const response = await request(app).post('/users').send({
         email:'user@exemplo',
         name:'user exemplo'
        });
       expect(response.status).toBe(201);
     });

     it('verificar se email ja exist no banco',async()=>{
        const response = await request(app).post('/users').send({
            email:'user@exemplo',
            name:'user exemplo'
           });
           expect(response.status).toBe(400);
     })
});