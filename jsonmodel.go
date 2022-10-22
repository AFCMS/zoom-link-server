package main

type JSONEntry struct {
	ID           uint   `json:"id"`
	Description  string `json:"description"`
	CreationDate int64  `json:"creation_date"`
	MeetingID    int32  `json:"meeting_id"`
	Passcode     string `json:"passcode"`
	PasscodeHash string `json:"passcode_hash"`
}

type JSONCreateEntry struct {
	Description  string `json:"description"`
	MeetingID    int32  `json:"meeting_id"`
	Passcode     string `json:"passcode"`
	PasscodeHash string `json:"passcode_hash"`
}

type JSONDeleteEntry struct {
	ID uint `json:"id"`
}
