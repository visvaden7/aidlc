import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import AppRoutes from '@/routes/AppRoutes';
import './App.css';

export default function App() {
  return (
    <ConfigProvider locale={koKR}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}
