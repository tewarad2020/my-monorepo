import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './app';

describe('App', () => {
  const fetchMock = vi.fn();
  beforeEach(() => { vi.stubGlobal('fetch', fetchMock); });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.resetAllMocks(); });
  const enter = (value: string) => fireEvent.change(screen.getByLabelText('ตัวเลขที่ต้องการคำนวณ'), { target: { value } });
  const submit = () => fireEvent.click(screen.getByRole('button', { name: /คำนวณค่าเฉลี่ย/ }));
  const success = (average = 20, sum = 60, count = 3) => fetchMock.mockResolvedValue({
    ok: true, json: async () => ({ average, sum, count }),
  });

  it('renders without requesting data initially', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('คำนวณค่าเฉลี่ย');
    expect(screen.getByLabelText('ค่าเฉลี่ย').textContent).toBe('—');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('posts the numbers and displays the API result', async () => {
    success(); render(<App />); enter('10, 20\n30'); submit();
    expect(fetchMock).toHaveBeenCalledWith('/express-api/average', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ numbers: [10, 20, 30] }),
    });
    await waitFor(() => expect(screen.getByLabelText('ค่าเฉลี่ย').textContent).toBe('20'));
    expect(screen.getByText('60')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });
  it('accepts decimals, negative numbers and zero', async () => {
    success(0, 0, 3); render(<App />); enter('-2.5 0 2.5'); submit();
    await waitFor(() => expect(screen.getByLabelText('ค่าเฉลี่ย').textContent).toBe('0'));
  });
  it.each(['', '   ', '1, abc', '1,', '1e999', '0x10', Array(10001).fill('1').join(',')])('rejects invalid input %#', (value) => {
    render(<App />); enter(value); submit();
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('provides example numbers', () => {
    render(<App />); fireEvent.click(screen.getByRole('button', { name: /ลองใช้ข้อมูลตัวอย่าง/ }));
    expect((screen.getByLabelText('ตัวเลขที่ต้องการคำนวณ') as HTMLTextAreaElement).value).toBe('10, 20, 30, 40, 50');
  });
  it('shows server validation errors', async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: 'ผลรวมมีขนาดใหญ่เกินไป' }) });
    render(<App />); enter('1 2'); submit();
    expect((await screen.findByRole('alert')).textContent).toBe('ผลรวมมีขนาดใหญ่เกินไป');
  });
  it('shows connection errors and allows retrying', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    render(<App />); enter('1 2'); submit();
    expect((await screen.findByRole('alert')).textContent).toContain('เชื่อมต่อ API ไม่สำเร็จ');
    expect((screen.getByRole('button', { name: /คำนวณค่าเฉลี่ย/ }) as HTMLButtonElement).disabled).toBe(false);
  });
  it('disables submission while waiting and clears stale results on edit', async () => {
    let resolve: (response: unknown) => void;
    fetchMock.mockReturnValue(new Promise((done) => { resolve = done; }));
    render(<App />); enter('10 30'); submit();
    expect((screen.getByRole('button', { name: /กำลังคำนวณ/ }) as HTMLButtonElement).disabled).toBe(true);
    resolve!({ ok: true, json: async () => ({ average: 20, sum: 40, count: 2 }) });
    await waitFor(() => expect(screen.getByLabelText('ค่าเฉลี่ย').textContent).toBe('20'));
    enter('50');
    expect(screen.getByLabelText('ค่าเฉลี่ย').textContent).toBe('—');
  });
  it('rejects unexpected API responses', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    render(<App />); enter('1'); submit();
    expect((await screen.findByRole('alert')).textContent).toContain('ข้อมูลตอบกลับจาก API ไม่ถูกต้อง');
  });
});
