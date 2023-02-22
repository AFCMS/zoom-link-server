import isDev from "./is_dev"

/**
 * The version of the app, MUST be updated before each release
 */
const VERSION = "1.3"

/**
 * Limit user input to valid meeting id
 * @param val The user entry
 */
function validate_id(val: string): boolean {
    // Validate string lenght
    if (val.length > 10) {
        return false
    }

    // Validate integer parsing
    if (val.length === 0) {
        return true
    }

    let pid = parseInt(val, 10)
    if (isNaN(pid) || pid.toString().length !== val.length) {
        return false
    }

    return true
}

const zoomDomain = /zoom\.us/
const zoomJoinUrl1 = /\/j\/(\d+)/
const zoomJoinUrl2 = /\/wc\/(\d+)\/join/

/**
 * Parse a zoom meeting URL, return an object with the id and passcode hash if present or nill if URL is invalid
 * @param val Zoom Meeting URL
 */
function parse_zoom_link(val: string): { id: number; passcode_hash: string | null } | null {
    try {
        const c = new URL(val)
        if (zoomDomain.exec(c.host)) {
            let meeting_id: string | null = null
            let meeting_passcode_hash: string | null = null
            let r1 = zoomJoinUrl1.exec(c.pathname)
            if (r1) {
                meeting_id = r1[1]
            }

            let r2 = zoomJoinUrl2.exec(c.pathname)
            if (r2) {
                meeting_id = r2[1]
            }

            if (meeting_id && validate_id(meeting_id) && meeting_id.length === 10) {
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

/**
 * @returns The API URL `"http://127.0.0.1:30000"` if in dev mode else `""`
 */
function apiUrl(): string {
    return isDev() ? "http://127.0.0.1:30000" : ""
}

/**
 * Similar to the database model, represent an entry
 */
type Entry = {
    id: number
    description: string
    meeting_id: number
    passcode: string
    passcode_hash: string
}

export { VERSION, parse_zoom_link, validate_id, apiUrl }

export type { Entry }
