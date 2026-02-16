const { resolve } = require('./safari.js');

describe('safariResolve function', () => {
  test('should return start.html for empty input', () => {
    expect(resolve('')).toBe('safari/start.html');
    expect(resolve(null)).toBe('safari/start.html');
    expect(resolve(undefined)).toBe('safari/start.html');
    expect(resolve('   ')).toBe('safari/start.html');
  });

  test('should return start.html for start keywords', () => {
    expect(resolve('start')).toBe('safari/start.html');
    expect(resolve('start page')).toBe('safari/start.html');
    expect(resolve('new tab')).toBe('safari/start.html');
    expect(resolve('START')).toBe('safari/start.html');
  });

  test('should return sohgle.html for google keywords', () => {
    expect(resolve('sohgle')).toBe('safari/sohgle.html');
    expect(resolve('google')).toBe('safari/sohgle.html');
    expect(resolve('google.com')).toBe('safari/sohgle.html');
    expect(resolve('GOOGLE')).toBe('safari/sohgle.html');
  });

  test('should return raw input for known prefixes', () => {
    expect(resolve('safari/test.html')).toBe('safari/test.html');
    expect(resolve('recipes/pasta.json')).toBe('recipes/pasta.json');
    expect(resolve('music/song.mp3')).toBe('music/song.mp3');
    expect(resolve('igit/repo')).toBe('igit/repo');
    expect(resolve('bin/script.sh')).toBe('bin/script.sh');
    expect(resolve('garlic-bread/recipe')).toBe('garlic-bread/recipe');
  });

  test('should return search query for other inputs', () => {
    expect(resolve('hello world')).toBe('safari/sohgle.html?q=hello%20world');
    expect(resolve('test')).toBe('safari/sohgle.html?q=test');
    expect(resolve('what is javascript')).toBe('safari/sohgle.html?q=what%20is%20javascript');
  });

  test('should trim input before processing', () => {
     expect(resolve('  start  ')).toBe('safari/start.html');
     expect(resolve('  hello  ')).toBe('safari/sohgle.html?q=hello');
  });
});
