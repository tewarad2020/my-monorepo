import express, { type ErrorRequestHandler } from 'express';
import * as path from 'path';
import { calculateAverage, calculateVat } from '@my-monorepo/shared-types';

export const app = express();
app.use(express.json({ limit: '256kb' }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/express-api', (_req, res) => {
  const basePrice = 3500;
  const vat = calculateVat(basePrice);
  res.json({
    id: 101,
    name: 'Monorepo Mechanical Keyboard',
    price: basePrice,
    vat,
    totalPrice: basePrice + vat,
    inStock: true,
  });
});

app.post('/express-api/average', (req, res) => {
  try {
    res.json(calculateAverage(req.body?.numbers));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error.type === 'entity.too.large') {
    res.status(413).json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป' });
  } else if (error.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'รูปแบบ JSON ไม่ถูกต้อง' });
  } else {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
};
app.use(handleError);