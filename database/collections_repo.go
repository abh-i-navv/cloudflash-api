package database

import (
	"cloudflash-api/domain"
	"database/sql"
	"time"
)

// ──────────────────────────── Collections ────────────────────────────

func CreateCollection(c domain.Collection) error {
	query := `
	INSERT INTO collections (id, name, created_at, updated_at)
	VALUES (?, ?, ?, ?)
	`
	_, err := DB.Exec(query, c.ID, c.Name, c.CreatedAt, c.UpdatedAt)
	return err
}

func GetCollections() ([]domain.Collection, error) {
	query := `
	SELECT id, name, created_at, updated_at
	FROM collections
	ORDER BY created_at ASC
	`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var collections []domain.Collection
	for rows.Next() {
		var c domain.Collection
		if err := rows.Scan(&c.ID, &c.Name, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		collections = append(collections, c)
	}

	if collections == nil {
		collections = []domain.Collection{}
	}
	return collections, nil
}

func UpdateCollection(id, name string) error {
	query := `
	UPDATE collections SET name = ?, updated_at = ? WHERE id = ?
	`
	_, err := DB.Exec(query, name, time.Now().UnixMilli(), id)
	return err
}

func DeleteCollection(id string) error {
	query := `DELETE FROM collections WHERE id = ?`
	_, err := DB.Exec(query, id)
	return err
}

// ──────────────────────────── Folders ────────────────────────────

func CreateFolder(f domain.Folder) error {
	query := `
	INSERT INTO folders (id, collection_id, parent_folder_id, name, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?)
	`
	_, err := DB.Exec(query, f.ID, f.CollectionID, f.ParentFolderID, f.Name, f.CreatedAt, f.UpdatedAt)
	return err
}

func GetFolders(collectionID string) ([]domain.Folder, error) {
	query := `
	SELECT id, collection_id, parent_folder_id, name, created_at, updated_at
	FROM folders
	WHERE collection_id = ?
	ORDER BY created_at ASC
	`
	rows, err := DB.Query(query, collectionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var folders []domain.Folder
	for rows.Next() {
		var f domain.Folder
		var parentID sql.NullString
		if err := rows.Scan(&f.ID, &f.CollectionID, &parentID, &f.Name, &f.CreatedAt, &f.UpdatedAt); err != nil {
			return nil, err
		}
		if parentID.Valid {
			f.ParentFolderID = &parentID.String
		}
		folders = append(folders, f)
	}

	if folders == nil {
		folders = []domain.Folder{}
	}
	return folders, nil
}

func RenameFolder(id, name string) error {
	query := `
	UPDATE folders SET name = ?, updated_at = ? WHERE id = ?
	`
	_, err := DB.Exec(query, name, time.Now().UnixMilli(), id)
	return err
}

func MoveFolder(id, collectionID string, parentFolderID *string) error {
	query := `
	UPDATE folders SET collection_id = ?, parent_folder_id = ?, updated_at = ? WHERE id = ?
	`
	_, err := DB.Exec(query, collectionID, parentFolderID, time.Now().UnixMilli(), id)
	return err
}

func DeleteFolder(id string) error {
	query := `DELETE FROM folders WHERE id = ?`
	_, err := DB.Exec(query, id)
	return err
}

// ──────────────────────────── Saved Requests ────────────────────────────

func SaveRequest(r domain.SavedRequest) error {
	query := `
	INSERT OR REPLACE INTO saved_requests
	(id, collection_id, folder_id, name, method, url, body, headers, params, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := DB.Exec(query,
		r.ID, r.CollectionID, r.FolderID,
		r.Name, r.Method, r.URL, r.Body,
		r.Headers, r.Params,
		r.CreatedAt, r.UpdatedAt,
	)
	return err
}

func GetSavedRequests(collectionID string) ([]domain.SavedRequest, error) {
	query := `
	SELECT id, collection_id, folder_id, name, method, url, body, headers, params, created_at, updated_at
	FROM saved_requests
	WHERE collection_id = ?
	ORDER BY created_at ASC
	`
	rows, err := DB.Query(query, collectionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []domain.SavedRequest
	for rows.Next() {
		var r domain.SavedRequest
		var folderID sql.NullString
		if err := rows.Scan(
			&r.ID, &r.CollectionID, &folderID,
			&r.Name, &r.Method, &r.URL, &r.Body,
			&r.Headers, &r.Params,
			&r.CreatedAt, &r.UpdatedAt,
		); err != nil {
			return nil, err
		}
		if folderID.Valid {
			r.FolderID = &folderID.String
		}
		requests = append(requests, r)
	}

	if requests == nil {
		requests = []domain.SavedRequest{}
	}
	return requests, nil
}

func DeleteSavedRequest(id string) error {
	query := `DELETE FROM saved_requests WHERE id = ?`
	_, err := DB.Exec(query, id)
	return err
}
