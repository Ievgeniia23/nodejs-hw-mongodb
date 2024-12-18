import express from 'express';
import cors from 'cors';
import pino from 'pino-http';


import *as contactServices from "./services/contacts.js";

import { getEnvVar } from './utils/getEnvVar.js';



export const setupServer = () => {
    const app = express();

  app.use(cors());
  app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty'
        }
    }));

  app.get('/contacts', async (req, res) => {
    const contacts = await contactServices.getContacts();

  res.json(contacts);
  });
  
  app.get("/contacts/:id", async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    const data = await contactServices.getContactById(id);

    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id=${id} not found`
      });
    }
       
    
    res.json({
      status: 200,
      message: `Successfully found contact with id =${id}`,
      data,

    });

  });

app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} not found`,
  });
});

    const port = Number(getEnvVar("PORT", 3000));
app.listen(port, () => console.log(`Server is running on ${port} port`));

};








