import './Button.css';

export default function Button({ href, children = 'TEXT', onClick, className = '', type = 'button', ...props }) {
  const classes = `button ${className}`.trim();
  return href ? <a {...props} className={classes} href={href} onClick={onClick}>{children}</a>
    : <button {...props} className={classes} type={type} onClick={onClick}>{children}</button>;
}
