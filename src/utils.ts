export function uniq<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function includesOneof<T>(target: T[], array: T[]): boolean {
  return array.some(item => {
    if (target.includes(item)) {
      const omitted = target.filter(t => t !== item);
      if (array.every(a => !omitted.includes(a))) {
        return true;
      }
      return false;
    }
    return false;
  });
}
