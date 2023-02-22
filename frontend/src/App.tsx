import axios from "axios"
import "./App.css"
import { useEffect, useState } from "react"
import { PlusIcon, CommandLineIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import EntryElement from "./EntryElement"
import { VERSION, Entry, parse_zoom_link, validate_id, apiUrl } from "./utils"

function App() {
    const url = apiUrl()

    const [loading, setLoading] = useState(true)
    const [entries, setEntries] = useState<Entry[] | null>(null)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [loadingError, setLoadingError] = useState(null)

    const [addDescription, setAddDescription] = useState("")
    const [addMeetingID, setAddMeetingID] = useState("")
    const [addPasscode, setAddPasscode] = useState("")
    const [addPasscodeHash, setAddPasscodeHash] = useState("")
    const [addOpen, setAddOpen] = useState(false)
    const [addError, setAddError] = useState(null)

    const [reload, setReload] = useState(0)

    useEffect(() => {
        axios
            .get(url + "/api/all")
            .then((response) => {
                setLoading(false)
                setEntries(response.data)
            })
            .catch((e) => {
                setLoading(false)
                setLoadingError(e.message)
            })
    }, [reload, url])

    function create_entry() {
        setLoadingCreate(true)
        axios
            .post(url + "/api/create", {
                description: addDescription,
                meeting_id: parseInt(addMeetingID),
                passcode: addPasscode,
                passcode_hash: addPasscodeHash,
            })
            .then((response) => {
                //console.log(response)
                setLoadingCreate(false)
                setAddOpen(false)
                setAddDescription("")
                setAddMeetingID("")
                setAddPasscode("")
                setAddPasscodeHash("")
                setReload(reload + 1)
            })
            .catch((e) => {
                setLoadingCreate(false)
                setAddError(e.message)
            })
    }

    /**
     * @param {React.MouseEventHandler} event
     */
    /* async function click_url_handler(event) {
        const match = await navigator.clipboard.readText().then((e) => e.match(regexZoomURL))
        if (match) {
            setAddMeetingID(match[1])
            setAddPasscodeHash(match[2] ? match[2] : "")
        }
    } */

    // Request permission for clipboard read
    /* navigator.permissions.query({ name: "clipboard-read", allowWithoutGesture: false }).then((permissionStatus) => {
        // Will be 'granted', 'denied' or 'prompt':
        console.log(permissionStatus.state)

        // Listen for changes to the permission state
        permissionStatus.onchange = () => {
            console.log(permissionStatus.state)
        }
    })*/

    return (
        <div className="flex w-screen flex-row items-center justify-center p-0 sm:p-2">
            <div className="flex w-full columns-3 flex-col bg-slate-200 sm:w-4/6 sm:rounded sm:border sm:border-slate-700 md:w-4/6 lg:w-3/6 xl:w-2/6">
                <div className="flex h-16 w-full items-center bg-blue-500 p-5">
                    <h1 className="h-max text-left text-3xl font-bold text-blue-900">Zoom Link Server</h1>
                    <div className="grow"></div>
                    <div className="">
                        <a
                            className="text-right text-blue-800 md:block"
                            href="https://github.com/AFCMS/zoom-link-server"
                        >
                            <span className="hidden md:inline">v{VERSION} - Made by AFCM</span>
                            <CommandLineIcon className="h-8 w-8 md:hidden" />
                        </a>
                    </div>
                </div>

                <div className="flex h-12 w-full items-center justify-items-end bg-blue-300 p-2">
                    <button
                        className="h-8 w-8 rounded bg-blue-500"
                        onClick={(e) => {
                            if (addOpen) {
                                setAddOpen(false)
                                setAddError(null)
                            } else {
                                setAddOpen(true)
                            }
                        }}
                    >
                        <PlusIcon className={`${addOpen ? "rotate-45" : ""} transition`} />
                    </button>
                    <div
                        className={`${
                            addOpen ? "" : "hidden"
                        } -ml-6 mt-16 h-4 w-4 rotate-45 overflow-auto bg-slate-500`}
                    ></div>
                </div>

                <div className={`${addOpen ? "" : "hidden"} m-2 rounded bg-slate-500 p-2 pl-4 transition-all`}>
                    <div className="flex flex-row">
                        <span className="h-max text-xl text-black">Create Entry</span>
                        <div className="grow"></div>
                        <input
                            type="text"
                            className="zl-text-field-paste justify-center rounded bg-slate-400 p-1 text-center"
                            onPaste={(e) => {
                                // console.log(e.clipboardData.getData("Text"))
                                var t = e.clipboardData.getData("Text")
                                var r = parse_zoom_link(t)
                                if (r != null) {
                                    setAddMeetingID(r.id.toString())
                                    setAddPasscodeHash(r.passcode_hash ? r.passcode_hash : "")
                                }
                            }}
                            onChange={() => {}}
                            value={""}
                            placeholder="From URL"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Description:</div>
                        <input
                            type="text"
                            className={`zl-text-field ${
                                addDescription.length > 0 && addDescription.trim().length > 0
                                    ? "border-green-500"
                                    : "border-red-500"
                            }`}
                            value={addDescription}
                            onChange={(e) => {
                                setAddDescription(e.target.value)
                            }}
                            placeholder="Description of the entry"
                            title="The description of the entry. Make sure to make it's good!"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Meeting ID:</div>
                        <input
                            type="text"
                            className={`zl-text-field ${
                                addMeetingID.length === 10 ? "border-green-500" : "border-red-500"
                            }`}
                            value={addMeetingID}
                            onChange={(e) => {
                                if (validate_id(e.target.value)) {
                                    setAddMeetingID(e.target.value)
                                }
                            }}
                            placeholder="123 456 7890"
                            title="The ID of the meeting"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Passcode:</div>
                        <input
                            type="text"
                            className={"zl-text-field zl-text-field-default"}
                            value={addPasscode}
                            onChange={(e) => {
                                setAddPasscode(e.target.value)
                            }}
                            placeholder="SuperStrongPasscode (optional)"
                            title="The meeting passcode. Unlike the hash version, it will just be copied instead of included into the join link."
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Passcode Hash:</div>
                        <input
                            type="text"
                            className={"zl-text-field zl-text-field-default"}
                            value={addPasscodeHash}
                            onChange={(e) => {
                                //if (validate_id(e.target.value)) {
                                setAddPasscodeHash(e.target.value)
                                //}
                            }}
                            placeholder="Passcode Hash (optional)"
                            title="The meeting passcode in hash form. It is used to create links which include the passcode. You can still provide the raw passcode if you want."
                        />
                    </div>
                    <div className={`mt-1 h-7 w-full text-red-800 ${addError ? "block" : "hidden"}`}>
                        <ExclamationTriangleIcon className="inline h-7" />
                        <span className="ml-2 inline">{addError}</span>
                    </div>
                    <button
                        className={`mt-2 h-8 w-full rounded bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600 ${
                            loadingCreate ? "cursor-wait" : "cursor-default"
                        }`}
                        disabled={(() => {
                            if (
                                !(validate_id(addMeetingID) && addMeetingID.length === 10 && addDescription.length > 0)
                            ) {
                                return true
                            } else {
                                return false
                            }
                        })()}
                        onClick={(e) => {
                            create_entry()
                        }}
                    >
                        {loadingCreate ? "Loading..." : "Create"}
                    </button>
                </div>

                <div className="flex flex-col justify-center p-2 pt-0">
                    {(() => {
                        if (loading === true) {
                            return <div className="mt-2 h-7 items-center">Loading...</div>
                        } else if (loadingError) {
                            return (
                                <div className="mt-2 h-7 items-center text-red-800">
                                    <ExclamationTriangleIcon className="inline h-7" />
                                    <span className="ml-2">{loadingError}</span>
                                </div>
                            )
                        } else {
                            return (
                                <>
                                    {entries === null ? (
                                        <div className="mt-2 items-center">No Entries</div>
                                    ) : (
                                        entries.map((e) => {
                                            return (
                                                <EntryElement e={e} reload={reload} setReload={setReload} key={e.id} />
                                            )
                                        })
                                    )}
                                </>
                            )
                        }
                    })()}
                </div>
            </div>
        </div>
    )
}

export default App
