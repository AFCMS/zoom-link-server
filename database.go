package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Entry struct {
	gorm.Model
	ID           uint   `gorm:"primarykey;unique;autoIncrement"`
	Description  string `gorm:"not null"`
	CreationDate int64  `gorm:"not null"`
	MeetingID    int64  `gorm:"not null;check:meeting_id between 0 and 9999999999"`
	Passcode     string `gorm:""`
	PasscodeHash string `gorm:""`
}

func InitDatabase() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{
		Logger: logger.Default,
	})

	if err != nil {
		log.Fatalln("Failed to connect to database")
	}

	if res := db.Exec("PRAGMA foreign_keys = ON", nil); res.Error != nil {
		log.Fatalln(res.Error)
	}

	err = db.AutoMigrate(&Entry{})

	if err != nil {
		log.Fatalln("Failed to migrate database")
	}

	return db
}
