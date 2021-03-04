import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'


describe("Surveys",()=>{
    
    beforeAll(async()=>{
    const Connection = await createConnection();
    await Connection.runMigrations();
    });

    afterAll(async()=>{
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.close();
    })
    

     it('criar comentario / email', async ()=>{
        const response = await request(app).post('/surveys').send({
         title:'title exemplo',
         description:' exemplo'
        });
       expect(response.status).toBe(201);
       expect(response.body).toHaveProperty('id');
     });

     it('pegar comentarios',async()=>{
            await request(app).post('/surveys').send({
            title:'title exemplo22',
            description:' exemplo22'
           });
           const response = await request(app).get('/surveys');

           expect(response.body.length).toBe(2);
     })
});