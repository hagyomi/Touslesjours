import { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DetailDialog from './components/common/DetailDialog';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Menu from './components/Home/Menu';
import { getAppPath } from './js/paths';
import './App.css';

export default function App() {
  const [selection, setSelection] = useState(null);
  const [giftOrigin, setGiftOrigin] = useState(null);
  const pathname = getAppPath();
  const isMenuPage = /^\/menu(?:\/products)?\/?$/.test(pathname);
  const isLoginPage = /^\/login\/?$/.test(pathname);
  return (
    <>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <Header isMenuPage={isMenuPage} isLoginPage={isLoginPage} onSearch={() => setSelection({ type: 'search' })} />
      {isLoginPage ? <Login /> : isMenuPage ? <main id="main-content" className="menu-page">
        <div className="inner menu-page__intro"><h1>Menu</h1><p>매일 새롭게 만나는 뚜레쥬르의 메뉴</p></div>
        <Menu onSelect={setSelection} />
      </main> : <Home onSelect={setSelection} onGift={(name, origin) => { setGiftOrigin(origin); setSelection({ type: 'collection', name }); }} />}
      <Footer />
      {selection && <DetailDialog selection={selection} origin={giftOrigin} onClose={() => { setSelection(null); setGiftOrigin(null); }} onSelect={setSelection} />}
    </>
  );
}
