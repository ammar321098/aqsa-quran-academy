let listeners: (() => void)[] = [];

export function subscribeAuthChange(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

export function notifyAuthChange() {
  listeners.forEach((cb) => cb());
}
