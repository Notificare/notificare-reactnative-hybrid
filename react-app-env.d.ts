// Allow TS to import PNG files
declare module '*.png' {
  const value: any;
  export default value;
}
