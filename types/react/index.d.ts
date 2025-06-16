declare namespace React {
  interface ReactNode {}
  interface ReactElement {}
  interface Component<P = any> {}
  export interface FC<P = any> {
    (props: P): any
  }
}
declare var React: any;
declare module 'react' {
  export = React;
}
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
