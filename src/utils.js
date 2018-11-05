export const cx = (baseClass, ...rest) => {
  const classes = [baseClass];

  for (const argument of rest) {
    const type = typeof argument;

    if (type === 'object') {
      for (const key in argument) {
        if (argument.hasOwnProperty(key) && argument[key]) {
          classes.push(`${baseClass}-${key}`);
        }
      }
    } else if (type === 'string' || type === 'number') {
      classes.push(`${baseClass}-${argument}`);
    }
  }

  return classes.join(' ');
};