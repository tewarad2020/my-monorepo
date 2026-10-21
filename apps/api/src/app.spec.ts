import { type Server } from 'node:http';
import { type AddressInfo } from 'node:net';
import { app } from './app';

describe('average API', () => {
  let server: Server;
  let baseUrl: string;
  beforeAll(async () => {
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });
  const post = (body: unknown) => fetch(`${baseUrl}/express-api/average`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  it('calculates via HTTP', async () => {
    const response = await post({ numbers: [10, 20, 30] });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ average: 20, sum: 60, count: 3 });
  });
  it('supports negative numbers and decimals', async () => {
    expect(await (await post({ numbers: [-2.5, 0, 4] })).json()).toEqual({ average: .5, sum: 1.5, count: 3 });
  });
  it.each([{}, null, { numbers: [] }, { numbers: [1, '2'] }, { numbers: [null] },
    { numbers: Array(10001).fill(1) }, { numbers: [1e308, 1e308] }])('rejects invalid request %#', async (body) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty('error');
  });
  it('returns JSON errors for malformed JSON', async () => {
    const response = await fetch(`${baseUrl}/express-api/average`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken',
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty('error');
  });
  it('limits request body size', async () => {
    const response = await post({ numbers: ['1'.repeat(300_000)] });
    expect(response.status).toBe(413);
    expect(await response.json()).toHaveProperty('error');
  });
  it('preserves the existing product endpoint', async () => {
    const response = await fetch(`${baseUrl}/express-api`);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 101, price: 3500, totalPrice: 3745 });
  });
});