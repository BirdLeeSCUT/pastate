

export function delay(ms: number) {
    return new Promise(resole => setTimeout(() => resole(), ms))
}