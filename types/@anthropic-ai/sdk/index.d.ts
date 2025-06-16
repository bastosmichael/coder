export default class Anthropic {
  messages: { create: (...args: any[]) => Promise<any> };
}
export namespace Anthropic {
  namespace Messages {
    export interface MessageParam {
      role: string;
      content: string;
    }
  }
}
