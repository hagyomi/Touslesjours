import './GiftCard.css';

export default function GiftCard({
    title = 'Text',
    subtitle = 'TEXT',
    description = ['text', 'text', 'text', 'text'],
    href,
    onClick,
    className = '',
    children,
    arrowSrc = '/images/common/gift-card-arrow.svg',
    arrowSize = 32,
}) {
    const lines = Array.isArray(description) ? description : description.split('\n');
    const content = (
        <>
            {children}
            <img
                className="gift-card__arrow"
                src={arrowSrc}
                alt=""
                width={arrowSize}
                height={arrowSize}
            />
            <span className="gift-card__title">{title}</span>
            <span className="gift-card__subtitle">{subtitle}</span>
            <span className="gift-card__description">
                {lines.map((line, index) => (
                    <span key={index}>{line}</span>
                ))}
            </span>
        </>
    );
    const classes = `gift-card ${className}`.trim();

    if (href)
        return (
            <a className={classes} href={href} onClick={onClick}>
                {content}
            </a>
        );
    if (onClick)
        return (
            <button className={classes} type="button" onClick={onClick}>
                {content}
            </button>
        );
    return <article className={classes}>{content}</article>;
}
