import Card from './Card';
import './PickCard.css';

export default function PickCard({
    image = '/images/picks/strawberry-cake.png',
    imageAlt = '딸기가 올라간 생크림 케이크',
    className = '',
    imageStyle,
    title,
    description,
    buttonLabel,
    href,
    onClick,
}) {
    return (
        <div className={`pick-card ${className}`.trim()}>
            <div className="pick-card__visual">
            <img
                className="pick-card__image"
                style={imageStyle}
                src={image}
                alt={imageAlt}
                loading="lazy"
                draggable={false}
            />
            </div>
            {title != null && (
                <Card title={title} description={description} buttonLabel={buttonLabel} href={href} onClick={onClick} />
            )}
        </div>
    );
}
