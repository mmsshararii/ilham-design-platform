export function encodeId(num: number) {
  return num.toString(36)
}

export function decodeId(str: string) {
  return parseInt(str, 36)
}
