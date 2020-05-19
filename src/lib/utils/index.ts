import md5 from 'md5';

export function trimSlashes(str: string): string {
  let result = str;

  if (result.startsWith('/')) {
    result = result.slice(1);
  }

  if (result.endsWith('/')) {
    result = result.slice(0, result.length - 1);
  }

  return result;
}

export function createGravatarUrl(email: string): string {
  email = email.toLowerCase().trim();
  const hash = md5(email);
  return `https://gravatar.com/avatar/${hash}?s=512`;
}
