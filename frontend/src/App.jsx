import axios from "axios"
import "./App.css"
import { useEffect, useState } from "react"
import {
    PlusIcon,
    ArrowUpRightIcon,
    ComputerDesktopIcon,
    CommandLineIcon,
    TrashIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid"

// const regexZoomURL = /zoom\.us\/j\/(\d+)(?:\?pwd=(.+))/

/**
 * @param {string} val
 * @return {boolean}
 */
function validate_id(val) {
    //console.log(val.length)
    //console.log("parsed:", parseInt(val, 10))
    if (val.length >= 0 && val.length <= 10) {
        if (parseInt(val, 10) || val.length === 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function App() {
    const url = window.location.href

    const [loading, setLoading] = useState(true)
    const [entries, setEntries] = useState(null)
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
            .get(url + "api/all")
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
        //console.log(addMeetingID, ":", parseInt(addMeetingID))
        axios
            .post(url + "api/create", {
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
     * @param {integer} n
     */
    function delete_entry(n) {
        axios
            .post(url + "api/delete", {
                id: n,
            })
            .then((response) => {
                setReload(reload + 1)
            })
            .catch()
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
                            <span className="hidden md:inline">Made by AFCM</span>
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
                        <div
                            className="justify-center rounded bg-slate-400 p-1 text-center"
                            //onClick={click_url_handler}
                        >
                            From URL
                        </div>
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Description:</div>
                        <InformationCircleIcon
                            className="zl-text-icon"
                            title="The description of the entry. Make sure to make it good!"
                        />
                        <input
                            type="text"
                            className={`zl-text-field ${
                                addDescription.length > 0 ? "border-green-500" : "border-red-500"
                            }`}
                            value={addDescription}
                            onChange={(e) => {
                                setAddDescription(e.target.value)
                            }}
                            placeholder="Description of the entry"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Meeting ID:</div>
                        <InformationCircleIcon className="zl-text-icon" title="The ID of the meeting" />
                        <input
                            type="text"
                            className={`zl-text-field ${
                                addMeetingID.length === 9 ? "border-green-500" : "border-red-500"
                            }`}
                            value={addMeetingID}
                            onChange={(e) => {
                                if (validate_id(e.target.value)) {
                                    setAddMeetingID(e.target.value)
                                }
                            }}
                            placeholder="123 456 7890"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Passcode:</div>
                        <InformationCircleIcon
                            className="zl-text-icon"
                            title="The meeting passcode. Unlike the hash version, it will just be copied instead of included into the join link."
                        />
                        <input
                            type="text"
                            className={"zl-text-field"}
                            value={addPasscode}
                            onChange={(e) => {
                                setAddPasscode(e.target.value)
                            }}
                            placeholder="SuperStrongPasscode (optional)"
                        />
                    </div>
                    <div className="mt-1 flex w-full flex-row items-center">
                        <div className="text inline w-1/4">Passcode Hash:</div>
                        <InformationCircleIcon
                            className="zl-text-icon"
                            title="The meeting passcode in hash form. It is used to create links which include the passcode. You can still provide the raw passcode if you want."
                        />
                        <input
                            type="text"
                            className={"zl-text-field"}
                            value={addPasscodeHash}
                            onChange={(e) => {
                                //if (validate_id(e.target.value)) {
                                setAddPasscodeHash(e.target.value)
                                //}
                            }}
                            placeholder="Passcode Hash (optional)"
                        />
                    </div>
                    <div className={`mt-1 h-7 w-full text-red-800 ${addError ? "block" : "hidden"}`}>
                        <ExclamationTriangleIcon className="inline h-7" />
                        <span className="ml-2 inline">{addError}</span>
                    </div>
                    <button
                        className={`mt-2 h-8 w-full rounded bg-slate-700 ${
                            loadingCreate ? "cursor-wait" : "cursor-default"
                        }`}
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
                                                <div
                                                    className={
                                                        "mt-2 flex h-20 w-full items-center rounded bg-zinc-300 p-2 pl-4"
                                                    }
                                                    key={e.id}
                                                >
                                                    <div className="flex w-3/4 flex-col">
                                                        <div className="h-max text-xl text-black">
                                                            {e.description}
                                                            <TrashIcon
                                                                className="ml-1 inline h-5 w-5 overflow-auto text-transparent hover:text-slate-900"
                                                                onClick={() => {
                                                                    delete_entry(e.id)
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="text-start mt-1 h-max truncate text-lg text-slate-700">
                                                            <span className="mr-4">Meeting ID:</span>
                                                            <span className="mr-4">{e.meeting_id}</span>

                                                            {(() => {
                                                                if (e.passcode && e.passcode.lenght !== 0) {
                                                                    return (
                                                                        <>
                                                                            <span className="mr-4 hidden md:inline">
                                                                                Passcode:
                                                                            </span>
                                                                            <span className="hidden md:inline">
                                                                                {e.passcode}
                                                                            </span>
                                                                        </>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div className="flex w-1/4 flex-col truncate pt-2 pb-2">
                                                        <a
                                                            className="flex flex-row rounded bg-blue-500 p-1 text-sm"
                                                            href={`https://zoom.us/wc/join/${
                                                                e.passcode_hash
                                                                    ? e.meeting_id + "?pwd=" + e.passcode_hash
                                                                    : e.meeting_id
                                                            }`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={() => {
                                                                if (e.passcode) {
                                                                    navigator.clipboard.writeText(e.passcode)
                                                                }
                                                            }}
                                                        >
                                                            <span className="hidden overflow-hidden 2xl:inline">
                                                                Open in Browser
                                                            </span>
                                                            <span className="inline 2xl:hidden">Browser</span>
                                                            <div className="grow"></div>
                                                            <ArrowUpRightIcon className="inline h-5" />
                                                        </a>
                                                        <a
                                                            className="mt-2 flex flex-row rounded bg-blue-500 p-1 text-sm"
                                                            href="zoomus://"
                                                            onClick={() => {
                                                                if (e.passcode) {
                                                                    navigator.clipboard.writeText(e.passcode)
                                                                }
                                                            }}
                                                        >
                                                            <span className="hidden overflow-hidden 2xl:inline">
                                                                Open in App
                                                            </span>
                                                            <span className="inline 2xl:hidden">App</span>
                                                            <div className="grow"></div>
                                                            <ComputerDesktopIcon className="inline h-5" />
                                                        </a>
                                                    </div>
                                                </div>
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
