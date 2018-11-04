export const cxOptions = (baseClass, options) => {
  const classes = [baseClass];
  for (const key in options) {
    if (options.hasOwnProperty(key) && options[key]) {
      classes.push(`${baseClass}-${key}`);
    }
  }
  return classes.join(' ');
};