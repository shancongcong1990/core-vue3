class ReactiveEffect {
  private _fn: Function;
  deps = [];
  constructor(fn: Function, public scheduler: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    this.deps.forEach((dep: any) => {
      dep.delete(this)
    })
  }
}
const targetMap = new Map();
export function track(target: any, key: string | Symbol) {
  let depsMap = targetMap.get(target);
  if(!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if(!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target: any, key: string | Symbol) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for(const dep of deps) {
    if(dep.scheduler) {
      dep.scheduler();
    } else {
      dep.run();
    }
  
  }
}
let activeEffect: any;
export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run()
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}