import {Link} from 'react-router-dom';import {categories,categoryNames} from '../../services/productService';import './QuickCategorySection.css';
export default function QuickCategorySection(){return <nav className="quick-category" aria-label="빠른 메뉴 카테고리">{categories.map(c=><Link key={c} to={'/menu?category='+c} className={'quick-category__link'+(c==='All'?' quick-category__link--all':'')}>{c==='All'?'ALL':c.toUpperCase()}<span>{categoryNames[c]}</span></Link>)}</nav>;}

