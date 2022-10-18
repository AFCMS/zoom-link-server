import axios from "axios"
import "./App.css"
import { useEffect, useState } from "react"
import { PlusIcon, ArrowUpRightIcon, ComputerDesktopIcon, CommandLineIcon } from "@heroicons/react/24/solid"

/**
 * @param {string} val
 * @return {boolean}
 */
function validate_id(val) {
	console.log(val.length)
	console.log("parsed:", parseInt(val, 10))
	if (val.length >= 0 && val.length <= 9) {
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
	const [error, setError] = useState(null)
	const [loadingCreate, setLoadingCreate] = useState(false)

	const [addDescription, setAddDescription] = useState("")
	const [addMeetingID, setAddMeetingID] = useState("")
	const [addPasscode, setAddPasscode] = useState("")
	const [addOpen, setAddOpen] = useState(false)

	const [reload, setReload] = useState(0)

	useEffect(() => {
		axios
			.get(url + "api/all")
			.then((response) => {
				setLoading(false)
				setEntries(response.data)
			})
			.catch(() => {
				setError("An error occured")
			})
	}, [reload])

	function create_entry() {
		setLoadingCreate(true)
		axios
			.post(url + "api/create", {
				description: addDescription,
				meeting_id: parseInt(addMeetingID),
				passcode: addPasscode,
			})
			.then((response) => {
				console.log(response)
				setLoadingCreate(false)
				setReload(reload + 1)
			})
			.catch(() => {
				setLoadingCreate(false)
			})
	}

	return (
		<div className="flex w-screen flex-row items-center justify-center bg-slate-100 p-0 md:p-2">
			<div className="flex w-full columns-3 flex-col bg-slate-200 md:w-2/6 md:rounded md:border md:border-slate-700">
				<div className="flex h-16 w-full items-center bg-blue-500 p-5">
					<h1 className="h-max w-2/3 text-3xl font-bold text-blue-900">Zoom Link Server</h1>
					<div className="w-1/3">
						<a
							className="text-right text-blue-800 md:block"
							href="https://github.com/AFCMS/zoom-link-server"
						>
							<span className="hidden md:inline">Made by AFCM</span>
							<CommandLineIcon className="right-0 h-8 w-8 md:hidden" />
						</a>
					</div>
				</div>

				<div className="flex h-12 w-full items-center justify-items-end bg-blue-300 p-2">
					<button
						className="h-8 w-8 rounded bg-blue-500"
						onClick={(e) => {
							if (addOpen) {
								setAddOpen(false)
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
					<span className="h-max text-xl text-black">Create Entry</span>
					<div className="mt-1 flex w-full flex-row items-center">
						<div className="text inline w-1/4">Description:</div>
						<input
							type="text"
							className={`inline w-3/4 rounded border-2 bg-slate-300 pl-1 ${
								addDescription.length > 0 ? "border-green-500" : "border-red-500"
							}`}
							value={addDescription}
							onChange={(e) => {
								console.log(e.target.value)
								setAddDescription(e.target.value)
							}}
							placeholder="Description of the entry"
						/>
					</div>
					<div className="mt-1 flex w-full flex-row items-center">
						<div className="text inline w-1/4">Meeting ID:</div>
						<input
							type="text"
							className={`inline w-3/4 rounded border-2 border-slate-600 bg-slate-300 pl-1 ${
								addMeetingID.length === 9 ? "border-green-500" : "border-red-500"
							}`}
							value={addMeetingID}
							onChange={(e) => {
								//console.log(e.target.value);
								if (validate_id(e.target.value)) {
									setAddMeetingID(e.target.value)
								}
							}}
							placeholder="123 456 7890"
						/>
					</div>
					<div className="mt-1 flex w-full flex-row items-center">
						<div className="text inline w-1/4">Passcode:</div>
						<input
							type="text"
							className={`inline w-3/4 rounded border-2 border-slate-600 bg-slate-300 pl-1`}
							value={addPasscode}
							onChange={(e) => {
								console.log(e.target.value)
								//if (validate_id(e.target.value)) {
								setAddPasscode(e.target.value)
								//}
							}}
							placeholder="SuperStrongPasscode (optional)"
						/>
					</div>
					<button
						className="mt-2 h-8 w-full rounded bg-slate-700"
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
							return <div className="mt-2 items-center">Loading...</div>
						} else if (error) {
							return <div className="mt-2 items-center">Error</div>
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
														<div className="h-max text-xl text-black">{e.description}</div>
														<div className="text-start mt-1 h-max text-lg text-slate-700">
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
													<div className="flex w-1/4 flex-col pt-2 pb-2">
														<a
															className="flex flex-row rounded bg-blue-500 p-1 text-sm"
															href={`https://zoom.us/j/${e.meeting_id}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															<span className="hidden md:inline">Open in Browser</span>
															<span className="inline md:hidden">Browser</span>
															<ArrowUpRightIcon className="ml-1 inline h-5" />
														</a>
														<a
															className="mt-2 flex flex-row rounded bg-blue-500 p-1 text-sm"
															href="zoomus://"
														>
															<span className="hidden md:inline">Open in App</span>
															<span className="inline md:hidden">App</span>
															<ComputerDesktopIcon className="ml-8 inline h-5" />
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
