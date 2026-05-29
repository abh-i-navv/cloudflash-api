package domain

// Collection represents a named group of saved requests and folders.
type Collection struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

// Folder represents a nested directory within a collection.
type Folder struct {
	ID             string  `json:"id"`
	CollectionID   string  `json:"collection_id"`
	ParentFolderID *string `json:"parent_folder_id"`
	Name           string  `json:"name"`
	CreatedAt      int64   `json:"created_at"`
	UpdatedAt      int64   `json:"updated_at"`
}

// SavedRequest represents an API request saved to a collection.
type SavedRequest struct {
	ID           string  `json:"id"`
	CollectionID string  `json:"collection_id"`
	FolderID     *string `json:"folder_id"`
	Name         string  `json:"name"`
	Method       string  `json:"method"`
	URL          string  `json:"url"`
	Body         string  `json:"body"`
	Headers      string  `json:"headers"`
	Params       string  `json:"params"`
	CreatedAt    int64   `json:"created_at"`
	UpdatedAt    int64   `json:"updated_at"`
}
