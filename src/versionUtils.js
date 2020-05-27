export const isNumber = str => (parseInt(str, 10).toString() == str) && (str.indexOf('-') === -1);

export const isVersionFormatCorrect = (versionString) => {
  if (versionString.split('+').length !== 2) return false;
  const [ versionName, versionCode ] = versionString.split('+');
  if (versionName.split('.').length !== 3) return false;
  const [ major, minor, patch ] = versionName.split('.');
  return (
    isNumber(major) &&
    isNumber(minor) &&
    isNumber(patch) &&
    isNumber(versionCode)
  );
}
