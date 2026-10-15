import { assets } from '../../data/home';
import './Footer.css';

export default function Footer() {
  return <footer className="footer">
    <div className="inner footer__inner"><h2>Baked fresh,<br />made for everyday moments.</h2>
      <div className="footer__middle"><p>Good bread.<br />Brighter days.<br />Always with you.</p><img src={assets.imgObject15} alt="" width="201" height="173" loading="lazy" /><p>Our story, locations,<br />and more delicious moments<br />are always here for you.</p></div>
      <a className="footer__logo" href="#top" aria-label="맨 위로"><img src={assets.imgImage30} alt="TOUS les JOURS" width="317" height="107" loading="lazy" /></a>
      <div className="footer__bottom"><div className="footer__legal"><span>© CJ푸드빌㈜</span><a href="https://www.tlj.co.kr/">개인정보처리방침</a><a href="https://www.tlj.co.kr/">이용약관</a></div><div className="footer__contact"><span>고객센터</span><a href="tel:15770700">1577-0700</a></div></div>
    </div>
  </footer>;
}
