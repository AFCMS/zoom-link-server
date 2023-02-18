import axios from "axios"
import { ArrowUpRightIcon, ComputerDesktopIcon, TrashIcon } from "@heroicons/react/24/solid"
import { Entry, apiUrl } from "./utils"

function EntryElement(props: { e: Entry; reload: number; setReload: React.Dispatch<React.SetStateAction<number>> }) {
    const e = props.e
    const url = apiUrl()

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

    return (
        <div className={"mt-2 flex h-20 w-full items-center rounded bg-zinc-300 p-2 pl-4"} key={e.id}>
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
                    href={`https://zoom.us/wc/join/${
                        e.passcode_hash ? e.meeting_id + "?pwd=" + e.passcode_hash : e.meeting_id
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
                    href="zoomus://"
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
    )
}

export default EntryElement
