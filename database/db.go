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
	CREATE INDEX IF NOT EXISTS idx_history_created_at ON request_history(created_at DESC);

	CREATE TABLE IF NOT EXISTS tabs(
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		method TEXT NOT NULL,
		url TEXT NOT NULL,
		body TEXT,
		headers TEXT,       
		params TEXT,          
		response TEXT,         
		position INTEGER NOT NULL,
		is_active INTEGER NOT NULL DEFAULT 0,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS folders (
		id TEXT PRIMARY KEY,

		collection_id TEXT NOT NULL,

		parent_folder_id TEXT,

		name TEXT NOT NULL,

		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,

		FOREIGN KEY (collection_id)
			REFERENCES collections(id)
			ON DELETE CASCADE,

		FOREIGN KEY (parent_folder_id)
			REFERENCES folders(id)
			ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS saved_requests (
		id TEXT PRIMARY KEY,

		collection_id TEXT NOT NULL,

		folder_id TEXT,

		name TEXT NOT NULL,

		method TEXT NOT NULL,
		url TEXT NOT NULL,
		body TEXT,

		headers TEXT,
		params TEXT,

		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,

		FOREIGN KEY (collection_id)
			REFERENCES collections(id)
			ON DELETE CASCADE,

		FOREIGN KEY (folder_id)
			REFERENCES folders(id)
			ON DELETE SET NULL
	);

	CREATE INDEX IF NOT EXISTS idx_folders_collection_id
	ON folders(collection_id);

	CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id
	ON folders(parent_folder_id);

	CREATE INDEX IF NOT EXISTS idx_saved_requests_collection_id
	ON saved_requests(collection_id);

	CREATE INDEX IF NOT EXISTS idx_saved_requests_folder_id
	ON saved_requests(folder_id);

	CREATE INDEX IF NOT EXISTS idx_saved_requests_created_at
	ON saved_requests(created_at DESC);
	`

	_, err := DB.Exec(query)

	if err != nil {
		log.Fatal(err)
	}

	// Run silent migrations to add missing columns in case tables already existed
	DB.Exec("ALTER TABLE collections ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0")
	DB.Exec("ALTER TABLE collections ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0")
	DB.Exec("ALTER TABLE folders ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0")
	DB.Exec("ALTER TABLE folders ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0")
	DB.Exec("ALTER TABLE saved_requests ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0")
	DB.Exec("ALTER TABLE saved_requests ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0")
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

	// Connection pool tuning
	db.SetMaxOpenConns(1) // SQLite only supports one writer
	db.SetMaxIdleConns(1)

	// SQLite performance pragmas
	pragmas := []string{
		"PRAGMA journal_mode=WAL",
		"PRAGMA synchronous=NORMAL",
		"PRAGMA cache_size=-8000",    // 8MB cache
		"PRAGMA mmap_size=268435456", // 256MB mmap
		"PRAGMA busy_timeout=5000",
		"PRAGMA foreign_keys=ON",
	}
	for _, p := range pragmas {
		if _, err := db.Exec(p); err != nil {
			log.Printf("Warning: %s failed: %v", p, err)
		}
	}

	log.Println("DB initialised at", dbPath)
	DB = db
	migrateCollectionsSchema()
	createTables()
}

func migrateCollectionsSchema() {
	shouldDrop := false

	// Check collections
	var colType1 string
	err1 := DB.QueryRow("SELECT type FROM pragma_table_info('collections') WHERE name='created_at'").Scan(&colType1)
	if err1 == nil && colType1 != "INTEGER" && colType1 != "integer" {
		shouldDrop = true
	}

	// Check folders
	var colType2 string
	err2 := DB.QueryRow("SELECT type FROM pragma_table_info('folders') WHERE name='created_at'").Scan(&colType2)
	if err2 == nil && colType2 != "INTEGER" && colType2 != "integer" {
		shouldDrop = true
	}

	// Check saved_requests
	var colType3 string
	err3 := DB.QueryRow("SELECT type FROM pragma_table_info('saved_requests') WHERE name='created_at'").Scan(&colType3)
	if err3 == nil && colType3 != "INTEGER" && colType3 != "integer" {
		shouldDrop = true
	}

	if shouldDrop {
		log.Println("Migrating collections database: old schema detected. Dropping old tables to recreate cleanly...")
		DB.Exec("PRAGMA foreign_keys=OFF")
		DB.Exec("DROP TABLE IF EXISTS saved_requests")
		DB.Exec("DROP TABLE IF EXISTS folders")
		DB.Exec("DROP TABLE IF EXISTS collections")
		DB.Exec("PRAGMA foreign_keys=ON")
	}
}
