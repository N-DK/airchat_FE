export const standardizeNames = (name) => {
    return name?.toUpperCase()?.replace(' ', '_') || '';
};
