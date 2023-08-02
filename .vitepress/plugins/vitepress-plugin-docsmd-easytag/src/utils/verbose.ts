export function isVerboseOn(): boolean {
    return process.env.VERBOSE === 'true' || process.env.VERBOSE === '1' || process.env.VERBOSE === 'on'
}
