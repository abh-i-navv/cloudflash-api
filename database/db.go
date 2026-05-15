package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

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
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	exeDir := filepath.Dir(exePath)
	dataDir := filepath.Join(exeDir, "data")

	err = os.MkdirAll(dataDir, 0o755)
	if err != nil {
		log.Fatal(err)
	}

	dbPath := filepath.Join(dataDir, "cloudflash.db")

	db, err := sql.Open("sqlite", dbPath)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("DB initialised at", dbPath)
	DB = db
	createTables()
}
