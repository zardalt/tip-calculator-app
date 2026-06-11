export function isCloser(left, right, center) {
  if (center - left <= right - center) return left;

  return right;
}

export function debounce(timeInMS, callback, setup) {
  let timer = null;

  return (callbackParams) => {
    setup?.call(null, callbackParams);
    clearTimeout(timer);
    timer = setTimeout(callback.bind(callbackParams), timeInMS);
  }
}

export function round(number) {
  if (Number.isInteger(number)) return number+'.00';

  const strNum = String(number).split('.');

  return strNum[0] + '.' + strNum[1].substring(0, 2).padEnd(2, '0');
}