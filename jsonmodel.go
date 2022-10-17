package main

type JSONEntry struct {
	ID           uint   `json:"id"`
	Description  string `json:"description"`
	CreationDate int64  `json:"creation_date"`
	MeetingID    int32  `json:"meeting_id"`
	Passcode     string `json:"passcode"`
}

type JSONCreateEntry struct {
	Description string `json:"description"`
	MeetingID   int32  `json:"meeting_id"`
	Passcode    string `json:"passcode"`
}

type JSONDeleteEntry struct {
	ID uint `json:"id"`
}
