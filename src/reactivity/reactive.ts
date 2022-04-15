import { track, trigger } from "./effect";

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target: any, p: string | symbol, receiver: any): any {
      const res = Reflect.get(target, p, receiver);
      // 收集依赖
      track(target, p);
      return res;
    },
    set(target: any, p: string | symbol, value: any, receiver: any): boolean {
      const res = Reflect.set(target, p, value, receiver);
      // 触发依赖
      trigger(target, p);
      return res;
    },
  });
}