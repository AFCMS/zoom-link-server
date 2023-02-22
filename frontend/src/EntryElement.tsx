import axios from "axios"
import { useState } from "react"
import {
    ArrowUpRightIcon,
    ComputerDesktopIcon,
    TrashIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid"
import { Entry, apiUrl, validate_id } from "./utils"

function EntryElement(props: { e: Entry; reload: number; setReload: React.Dispatch<React.SetStateAction<number>> }) {
    const e = props.e
    const url = apiUrl()

    const [edit, setEdit] = useState(false)
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [editError, setEditError] = useState(null)
    const [editDescription, setEditDescription] = useState(e.description)
    const [editMeetingID, setEditMeetingID] = useState(e.meeting_id.toString())
    const [editPasscode, setEditPasscode] = useState(e.passcode)
    const [editPasscodeHash, setEditPasscodeHash] = useState(e.passcode_hash)

    function delete_entry(n: number) {
        axios
            .post(url + "/api/delete", {
                id: n,
            })
            .then((response) => {
                props.setReload(props.reload + 1)
            })
            .catch()
    }

    function reset_edit() {
        setEditDescription(e.description)
        setEditMeetingID(e.meeting_id.toString())
        setEditPasscode(e.passcode)
        setEditPasscodeHash(e.passcode_hash)
    }

    function edit_entry() {
        setLoadingEdit(true)
        axios
            .patch(url + "/api/edit", {
                id: props.e.id,
                description: editDescription,
                meeting_id: parseInt(editMeetingID),
                passcode: editPasscode,
                passcode_hash: editPasscodeHash,
            })
            .then((response) => {
                //console.log(response)
                setLoadingEdit(false)
                setEdit(false)
                reset_edit()
                props.setReload(props.reload + 1)
            })
            .catch((e) => {
                setLoadingEdit(false)
                setEditError(e.message)
            })
    }

    return (
        <>
            <div className={"mt-2 flex h-20 w-full items-center rounded bg-zinc-300 p-2 pl-4"}>
                <div className="flex w-3/4 flex-col">
                    <div className="h-max text-xl text-black">
                        {e.description}
                        <div className="inline-block text-transparent hover:text-slate-800">
                            <TrashIcon
                                className="ml-1 inline h-5 w-5 overflow-auto hover:text-slate-900"
                                onClick={() => {
                                    delete_entry(e.id)
                                }}
                            />
                            <PencilSquareIcon
                                className="ml-1 inline h-5 w-5 overflow-auto hover:text-slate-900"
                                onClick={() => {
                                    reset_edit()
                                    setEdit(!edit)
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-1 h-max truncate text-start text-lg text-slate-700">
                        <span className="mr-4">Meeting ID:</span>
                        <span className="mr-4">{e.meeting_id}</span>

                        {(() => {
                            if (e.passcode && e.passcode.length !== 0) {
                                return (
                                    <>
                                        <span className="mr-4 hidden md:inline">Passcode:</span>
                                        <span className="hidden md:inline">{e.passcode}</span>
                                    </>
                                )
                            }
                        })()}
                    </div>
                </div>
                <div className="flex w-1/4 flex-col truncate pt-2 pb-2">
                    <a
                        className="flex flex-row rounded bg-blue-500 p-1 text-sm"
                        href={`https://zoom.us/wc/${
                            e.passcode_hash ? e.meeting_id + "/join?pwd=" + e.passcode_hash : e.meeting_id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            if (e.passcode) {
                                navigator.clipboard.writeText(e.passcode)
                            }
                        }}
                    >
                        <span className="hidden overflow-hidden 2xl:inline">Open in Browser</span>
                        <span className="inline 2xl:hidden">Browser</span>
                        <div className="grow"></div>
                        <ArrowUpRightIcon className="inline h-5" />
                    </a>
                    <a
                        className="mt-2 flex flex-row rounded bg-blue-500 p-1 text-sm"
                        href={`zoommtg://zoom.us/join?action=join&confno=${e.meeting_id}${
                            e.passcode ? "&pwd=" + e.passcode : ""
                        }`}
                        onClick={() => {
                            if (e.passcode) {
                                navigator.clipboard.writeText(e.passcode)
                            }
                        }}
                    >
                        <span className="hidden overflow-hidden 2xl:inline">Open in App</span>
                        <span className="inline 2xl:hidden">App</span>
                        <div className="grow"></div>
                        <ComputerDesktopIcon className="inline h-5" />
                    </a>
                </div>
            </div>

            <div className={`${edit ? "" : "hidden"} my-2 rounded bg-slate-500 p-2 pl-4 transition-all`}>
                <div className={"-mt-4 h-4 w-4 rotate-45 overflow-auto bg-slate-500"}></div>
                <div className="mt-1 flex w-full flex-row items-center">
                    <div className="text inline w-1/4">Description:</div>
                    <input
                        type="text"
                        className={`zl-text-field ${
                            editDescription.length > 0 && editDescription.trim().length > 0
                                ? "border-green-500"
                                : "border-red-500"
                        }`}
                        value={editDescription}
                        onChange={(e) => {
                            setEditDescription(e.target.value)
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
                            editMeetingID.length === 10 ? "border-green-500" : "border-red-500"
                        }`}
                        value={editMeetingID}
                        onChange={(e) => {
                            if (validate_id(e.target.value)) {
                                setEditMeetingID(e.target.value)
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
                        value={editPasscode}
                        onChange={(e) => {
                            setEditPasscode(e.target.value)
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
                        value={editPasscodeHash}
                        onChange={(e) => {
                            //if (validate_id(e.target.value)) {
                            setEditPasscodeHash(e.target.value)
                            //}
                        }}
                        placeholder="Passcode Hash (optional)"
                        title="The meeting passcode in hash form. It is used to create links which include the passcode. You can still provide the raw passcode if you want."
                    />
                </div>
                <div className={`mt-1 h-7 w-full text-red-800 ${editError ? "block" : "hidden"}`}>
                    <ExclamationTriangleIcon className="inline h-7" />
                    <span className="ml-2 inline">{editError}</span>
                </div>
                <div className="flex flex-row gap-2">
                    <button
                        className={"mt-2 h-8 w-full rounded bg-slate-700"}
                        onClick={(e) => {
                            setEdit(false)
                            reset_edit()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className={`mt-2 h-8 w-full rounded bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-600 ${
                            loadingEdit ? "cursor-wait" : "cursor-default"
                        }`}
                        disabled={(() => {
                            if (
                                !(
                                    validate_id(editMeetingID) &&
                                    editMeetingID.length === 10 &&
                                    editDescription.length > 0
                                )
                            ) {
                                return true
                            } else {
                                return false
                            }
                        })()}
                        onClick={edit_entry}
                    >
                        {loadingEdit ? "Loading..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default EntryElement
