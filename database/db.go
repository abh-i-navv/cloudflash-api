package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS request_history(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		
		method TEXT NOT NULL,

		url TEXT NOT NULL,

		body TEXT,

		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err := DB.Exec(query)

	if err != nil {
		log.Fatal(err)
	}
}

func InitDB() {
	db, err := sql.Open("sqlite", "./data/cloudflash.db")

	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB initialised")
	DB = db
	createTables()
}
