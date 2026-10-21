// // Uncomment this line to use CSS modules
// // import styles from './app.module.css';
// import NxWelcome from "./nx-welcome";

// import { Route, Routes, Link } from 'react-router-dom';

// export function App() {
//   return (
//     <div>
//       <NxWelcome title="web"/>
    
//     {/* START: routes */}
//     {/* These routes and navigation have been generated for you */}
//     {/* Feel free to move and update them to fit your needs */}
//     <br/>
//     <hr/>
//     <br/>
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/page-2">Page 2</Link></li>
//       </ul>
//     </nav>
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <div>This is the generated root route. <Link to="/page-2">Click here for page 2.</Link></div>
//         }
//       />
//       <Route
//         path="/page-2"
//         element={
//           <div><Link to="/">Click here to go back to root page.</Link></div>
//         }
//       />
//     </Routes>
//     {/* END: routes */}
//     </div>
//   );
// }

// export default App;


// import { useEffect, useState } from 'react';
// import { formatBaht } from '@my-monorepo/shared-types'; 

// interface APIResponse {
//   id: number;
//   name: string;
//   price: number;
//   vat: number;
//   totalPrice: number;
//   inStock: boolean;
// }

// export function App() {
//   const [expressData, setExpressData] = useState<APIResponse | null>(null);
//   const [goData, setGoData] = useState<APIResponse | null>(null);

//   useEffect(() => {
//     // 🟢 1. ดึงข้อมูลจาก Express Backend ผ่าน Proxy ตัวแรก
//     fetch('/express-api')
//       .then((res) => res.json())
//       .then((data: APIResponse) => setExpressData(data))
//       .catch((err) => console.error('Express Error:', err));

//     // 🐹 2. ดึงข้อมูลจาก Go Backend ผ่าน Proxy ตัวที่สอง
//     fetch('/go-api')
//       .then((res) => res.json())
//       .then((data: APIResponse) => setGoData(data))
//       .catch((err) => console.error('Go Error:', err));
//   }, []);

//   return (
//   <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
//     <h1>📦 Monorepo Multi-Backend Demo</h1>
    
//     <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
      
//       {/* 🟢 บล็อกแสดงผลของ Express */}
//       <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '12px', width: '300px', textAlign: 'left' }}>
//         <h3>🟢 Express Backend</h3>
//         {expressData ? (
//           <>
//             <p><strong>สินค้า:</strong> {expressData.name}</p>
//             <p style={{ color: '#ff5722', fontWeight: 'bold' }}>
//               <strong>ราคารวม:</strong> {formatBaht(expressData.totalPrice)}
//             </p>
//           </>
//         ) : (
//           <p>กำลังดึงข้อมูลจาก Node.js...</p>
//         )}
//       </div>

//       {/* 🐹 บล็อกแสดงผลของ Go (แก้ไขตรงนี้ให้ดึงข้อมูลจาก goData จริงๆ) */}
//       <div style={{ padding: '20px', border: '2px solid #FF9800', borderRadius: '12px', width: '300px', textAlign: 'left' }}>
//         <h3>🐹 Go Backend</h3>
//         {goData ? ( // ✨ เช็คตัวแปร goData
//           <>
//             {/* ✨ เปลี่ยนไปใช้คีย์ message และ source ตามที่เราเขียนไว้ในภาษา Go */}
//             <p><strong>สินค้า:</strong> {goData.name}</p> 
//             <p style={{ color: '#0070f3', fontWeight: 'bold' }}>
//               <strong>ราคารวม:</strong> {formatBaht(goData.totalPrice)}
//             </p>
//           </>
//         ) : (
//           <p>กำลังดึงข้อมูลจาก Golang...</p>
//         )}
//       </div>

//     </div>

//   </div>
// );

// }

// export default App;

import { AverageCalculator } from './average-calculator';

export function App() {
  return <AverageCalculator />;
}

export default App;