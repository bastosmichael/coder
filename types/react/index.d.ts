declare namespace React { interface Component<P = any> {} }
declare namespace React { export interface FC<P = any> { (props: P): any } }
declare var React: any;
declare module 'react' {
  export = React;
}
declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
