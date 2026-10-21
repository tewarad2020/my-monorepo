import { useState, type FormEvent } from 'react';
import {
  MAX_AVERAGE_NUMBERS,
  type AverageRequest,
  type AverageResponse,
} from '@my-monorepo/shared-types';
import styles from './app.module.css';

const example = '10, 20, 30, 40, 50';
const formatNumber = (value: number) =>
  new Intl.NumberFormat('th-TH', { maximumSignificantDigits: 12 }).format(value);

export function AverageCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AverageResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateInput(value: string) {
    setInput(value);
    setResult(null);
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);
    const tokens = input.trim().split(/[,\s]+/);
    const numbers = tokens.map(Number);
    const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    if (!input.trim() || tokens.some((token) => !decimal.test(token)) ||
      numbers.some((value) => !Number.isFinite(value)) || numbers.length > MAX_AVERAGE_NUMBERS) {
      setError('กรุณากรอกตัวเลขที่ถูกต้อง 1–10,000 ค่า คั่นด้วยจุลภาคหรือเว้นวรรค');
      return;
    }
    setLoading(true);
    try {
      const payload: AverageRequest = { numbers };
      const response = await fetch('/express-api/average', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ไม่สามารถคำนวณค่าเฉลี่ยได้');
      if (!Number.isFinite(data.average) || !Number.isFinite(data.sum) ||
        !Number.isInteger(data.count) || data.count < 1) {
        throw new Error('ข้อมูลตอบกลับจาก API ไม่ถูกต้อง');
      }
      setResult(data);
    } catch (cause) {
      setError(cause instanceof TypeError || cause instanceof SyntaxError
        ? 'เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบเซิร์ฟเวอร์แล้วลองใหม่'
        : (cause as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo} aria-hidden="true">μ</span>
        <span>NUMBER LAB <span className={styles.headerDetail}>/ เครื่องมือคำนวณ</span></span>
      </header>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>SIMPLE NUMBERS. CLEAR ANSWERS.</p>
        <h1>คำนวณค่าเฉลี่ย<span>ให้เป็นเรื่องง่าย</span></h1>
        <p>เปลี่ยนชุดตัวเลขให้เป็นคำตอบ กรอกข้อมูลของคุณแล้วให้เราคำนวณให้</p>
      </section>
      <div className={styles.workspace}>
        <section className={styles.card} aria-labelledby="input-title">
          <div className={styles.sectionHeading}>
            <h2 id="input-title">ชุดข้อมูลของคุณ</h2><span className={styles.badge}>01 / INPUT</span>
          </div>
          <form onSubmit={handleSubmit} aria-busy={loading}>
            <label htmlFor="numbers">ตัวเลขที่ต้องการคำนวณ</label>
            <p id="numbers-help" className={styles.help}>คั่นด้วยจุลภาค เว้นวรรค หรือขึ้นบรรทัดใหม่ รองรับทศนิยมและค่าติดลบ</p>
            <textarea id="numbers" value={input} onChange={(event) => updateInput(event.target.value)}
              placeholder={example} rows={6} disabled={loading} spellCheck={false}
              aria-describedby={error ? 'numbers-help input-error' : 'numbers-help'} aria-invalid={!!error} />
            <div className={styles.inputFooter}>
              <span>สูงสุด 10,000 ค่า</span>
              <button type="button" className={styles.example} disabled={loading}
                onClick={() => updateInput(example)}>ลองใช้ข้อมูลตัวอย่าง ↗</button>
            </div>
            {error && <p id="input-error" className={styles.error} role="alert">{error}</p>}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? 'กำลังคำนวณ…' : 'คำนวณค่าเฉลี่ย'} <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
        <section className={`${styles.card} ${styles.resultCard}`} aria-labelledby="result-title" aria-live="polite" aria-busy={loading}>
          <div className={styles.sectionHeading}>
            <h2 id="result-title">ผลการคำนวณ</h2><span className={styles.badge}>02 / RESULT</span>
          </div>
          <div className={styles.average}>
            <p>ค่าเฉลี่ยเลขคณิต</p>
            <output aria-label="ค่าเฉลี่ย">{result ? formatNumber(result.average) : '—'}</output>
            <span>{loading ? 'กำลังรอผลจาก API' : result ? 'คำนวณเรียบร้อยแล้ว' : 'คำตอบของคุณจะแสดงที่นี่'}</span>
          </div>
          <dl className={styles.stats}>
            <div><dt>จำนวนข้อมูล</dt><dd>{result ? formatNumber(result.count) : '—'} <small>ค่า</small></dd></div>
            <div><dt>ผลรวม</dt><dd>{result ? formatNumber(result.sum) : '—'}</dd></div>
          </dl>
          <p className={styles.apiNote}>↗ ประมวลผลผ่าน Express API</p>
        </section>
      </div>
      <aside className={styles.formula}>
        <span className={styles.formulaIcon} aria-hidden="true">∑</span>
        <div><strong>เบื้องหลังคำตอบ</strong><p>ค่าเฉลี่ย = ผลรวมของตัวเลขทั้งหมด ÷ จำนวนข้อมูล</p></div>
        <span className={styles.formulaExample}>10 + 20 + 30 + 40 + 50 <span>÷ 5 = 30</span></span>
      </aside>
      <footer className={styles.footer}>NUMBER LAB <span>คำนวณตรงไปตรงมา ไม่เก็บข้อมูลที่กรอก</span></footer>
    </main>
  );
}