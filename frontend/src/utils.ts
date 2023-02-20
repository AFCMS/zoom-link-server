import isDev from "./is_dev"

const VERSION = "1.0"

const zoomDomain = /zoom\.us/
const zoomJoinUrl1 = /\/j\/(\d+)/

function parse_zoom_link(val: string): { id: number; passcode_hash: string | null } | null {
    try {
        const c = new URL(val)
        if (zoomDomain.exec(c.host)) {
            let meeting_id: string | null = null
            let meeting_passcode_hash: string | null = null
            let r = zoomJoinUrl1.exec(c.pathname)
            if (r) {
                meeting_id = r[1]
            }

            // TODO: match second url sheme

            if (meeting_id && !isNaN(parseInt(meeting_id))) {
                meeting_passcode_hash = c.searchParams.get("pwd")

                return { id: parseInt(meeting_id), passcode_hash: meeting_passcode_hash }
            } else {
                return null
            }
        } else {
            return null
        }
    } catch {
        return null
    }
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

export { VERSION, parse_zoom_link, validate_id, apiUrl }

export type { Entry }
