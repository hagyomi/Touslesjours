import { useState } from 'react';
import './Login.css';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isTestLoggedIn, setIsTestLoggedIn] = useState(false);

  function testLogin() {
    setError('');
    setPassword('');
    setIsTestLoggedIn(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (userId.trim() === 'test' && password === 'test1234') {
      testLogin();
    } else {
      setError('현재 테스트 계정만 이용할 수 있습니다. 아이디와 비밀번호를 확인해 주세요.');
    }
  }

  return <main id="main-content" className="login-page">
    <section className="login-card" aria-labelledby="login-title">
      <span className="login-card__eyebrow">TOUS les JOURS</span>
      <h1 id="login-title">로그인</h1>
      <p className="login-card__intro">뚜레쥬르와 함께하는 달콤한 일상</p>
      {isTestLoggedIn ? <div className="login-card__success" role="status">
        <h2>테스트 로그인 완료</h2>
        <p>테스트 회원님, 환영합니다.</p>
        <p>화면 확인을 위한 데모이며 실제 회원 인증은 수행하지 않습니다.</p>
        <a className="login-card__button login-card__button--primary" href="/menu">메뉴 둘러보기</a>
        <button className="login-card__button" type="button" onClick={() => { setIsTestLoggedIn(false); setUserId(''); }}>로그인 화면으로 돌아가기</button>
      </div> : <>
        <form className="login-card__form" onSubmit={handleSubmit}>
          <label htmlFor="login-id">아이디</label>
          <input id="login-id" name="username" autoComplete="username" placeholder="아이디를 입력해 주세요" required value={userId} onChange={event => { setUserId(event.target.value); setError(''); }} aria-describedby={error ? 'login-error' : undefined} />
          <label htmlFor="login-password">비밀번호</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" required value={password} onChange={event => { setPassword(event.target.value); setError(''); }} aria-describedby={error ? 'login-error' : undefined} />
          {error && <p id="login-error" className="login-card__error" role="alert">{error}</p>}
          <button className="login-card__button login-card__button--primary" type="submit">로그인</button>
          <button className="login-card__button" type="button" onClick={testLogin}>테스트용 로그인</button>
        </form>
        <p className="login-card__note">테스트 계정: <strong>test / test1234</strong><br />테스트용 로그인은 입력 없이 체험할 수 있습니다.<br />현재 실제 회원 로그인은 연결되어 있지 않습니다.</p>
      </>}
    </section>
  </main>;
}
