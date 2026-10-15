import { withBaseUrl } from '../js/paths.js';
import './EventCard.css';

export default function EventCard({
    number = 1,
    title = 'Text',
    description = ['Text', 'Text', 'Text'],
    href,
    onClick,
    className = '',
}) {
    const lines = Array.isArray(description) ? description : description.split('\n');
    const classes = `event-card ${className}`.trim();
    const content = (
        <>
            <span className="event-card__content">
                <span className="event-card__heading">
                    <span className="event-card__number">({number})</span>
                    <span className="event-card__title">{title}</span>
                </span>
                <span className="event-card__description">
                    {lines.map((line, index) => (
                        <span key={index}>{line}</span>
                    ))}
                </span>
            </span>
            <img
                className="event-card__arrow"
                src={withBaseUrl("/images/common/event-card-arrow.svg")}
                alt=""
                width="30"
                height="30"
            />
        </>
    );

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
