import './BenefitCard.css';export default function BenefitCard({number,title,children}){return <article className="benefit-card"><span>{number}</span><h2>{title}</h2><p>{children}</p></article>;}
