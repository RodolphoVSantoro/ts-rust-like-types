import express from 'express';
import { Request, Response } from 'express';
//import axios from 'axios';
import { OptionFrom } from './rust-types/option';


const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.get('/:origin/translate/:translated', async (req: Request, res: Response) => {
    const { origin: originParam, translated: translatedParam } = req.params;
    const origin = OptionFrom(originParam).unrwap();
    const translated = OptionFrom(translatedParam).unrwap();
    res.send("translate " + origin + " to " + translated);
});

app.post('/', async (req: Request, res: Response) => {
    const { body } = req;
    console.log(body);
    res.send({ a:body});
});