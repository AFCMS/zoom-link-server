import isDev from "./is_dev"

const regexZoomURL = /zoom\.us\/j\/(\d+)(?:\?pwd=(.+))/

function match_regex(val: string): number | null {
    var r = regexZoomURL.exec(val)
    console.log(r)
    return r ? parseInt(r[0]) : null
}

function validate_id(val: string): boolean {
    if (val.length >= 0 && val.length <= 10) {
        return !!(parseInt(val, 10) || val.length === 0)
    } else {
        return false
    }
}

function apiUrl(): string {
    return isDev() ? "http://127.0.0.1:30000" : ""
}

type Entry = {
    id: number
    description: string
    meeting_id: number
    passcode: string
    passcode_hash: string
}

export { regexZoomURL, match_regex, validate_id, apiUrl }

export type { Entry }
