package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
)

type Entry struct {
	gorm.Model
	ID           uint   `gorm:"primarykey;unique;autoIncrement"`
	Description  string `gorm:"not null;unique"`
	CreationDate int64  `gorm:"not null"`
	MeetingID    int32  `gorm:"not null;unique;check:meeting_id between 0 and 999999999"`
	Passcode     string `gorm:"default:"`
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
