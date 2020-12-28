import express from 'express';
import { calc, redisStudy } from '~/common';
import path from 'path';


const app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

console.log('calc', calc(2, 2));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

redisStudy();
