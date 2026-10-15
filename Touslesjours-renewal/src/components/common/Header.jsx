import { assets } from '../../data/home';
import { withBaseUrl } from '../../js/paths';
import './Header.css';

const navigation = [
  { label: 'Menu', href: withBaseUrl('menu/') },
  { label: 'Store', href: withBaseUrl('#store') },
  { label: 'Search' },
  { label: 'Login', href: withBaseUrl('login/') },
  { label: 'Membership', href: withBaseUrl('#event') },
];

export default function Header({ onSearch, isMenuPage, isLoginPage }) {
  return <header className="header" id="top"><div className="inner">
    <a className="header__logo" href={withBaseUrl('')} aria-label="뚜레쥬르 홈"><img src={assets.imgImage12} alt="TOUS les JOURS" width="305" height="87" /></a>
    <nav className="header__nav" aria-label="주요 메뉴"><ul className="header__list">{navigation.map(({ label, href }) => <li key={label}>{href ? <a className="header__link" href={href} aria-current={(label === 'Menu' && isMenuPage) || (label === 'Login' && isLoginPage) ? 'page' : undefined}>{label}</a> : <button type="button" className="header__link" onClick={onSearch}>{label}</button>}</li>)}</ul></nav>
  </div></header>;
}

