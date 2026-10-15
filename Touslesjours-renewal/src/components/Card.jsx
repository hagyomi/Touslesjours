import './common/CardContent.css';
import './Card.css';

export default function Card({
    title = 'TEXT',
    description = ['TEXT', 'TEXT', 'TEXT'],
    buttonLabel = 'MORE',
    href,
    onClick,
    className = '',
}) {
    const lines = Array.isArray(description) ? description : description.split('\n');

    return (
        <article className={`card ${className}`.trim()}>
            <div className="card__copy">
                <h3 className="card__title">{title}</h3>
                <p className="card__description">
                    {lines.map((line, index) => (
                        <span key={index}>{line}</span>
                    ))}
                </p>
            </div>
            {href ? (
                <a
                    className="card__button"
                    href={href}
                    onClick={onClick}
                    aria-label={`${title}: ${buttonLabel}`}
                >
                    {buttonLabel}
                </a>
            ) : (
                <button
                    className="card__button"
                    type="button"
                    onClick={onClick}
                    disabled={!onClick}
                    aria-label={`${title}: ${buttonLabel}`}
                >
                    {buttonLabel}
                </button>
            )}
        </article>
    );
}
