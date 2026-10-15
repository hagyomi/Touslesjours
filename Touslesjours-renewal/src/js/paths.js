export const withBaseUrl = (path) => {
    const base = import.meta.env?.BASE_URL ?? '/';
    return `${base}${path.replace(/^\//, '')}`;
};

export const getAppPath = () => {
    const base = import.meta.env?.BASE_URL ?? '/';
    const pathname = window.location.pathname;
    return pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
};
