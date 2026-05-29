package app

import (
	"cloudflash-api/database"
	"cloudflash-api/domain"
	"fmt"
)

// ──────────────────────────── Collections ────────────────────────────

func (a *App) CreateCollection(c domain.Collection) error {
	err := database.CreateCollection(c)
	if err != nil {
		fmt.Printf("Error creating collection: %v\n", err)
		return err
	}
	return nil
}

func (a *App) GetCollections() []domain.Collection {
	collections, err := database.GetCollections()
	if err != nil {
		fmt.Printf("Error loading collections: %v\n", err)
		return []domain.Collection{}
	}
	return collections
}

func (a *App) UpdateCollection(id, name string) error {
	err := database.UpdateCollection(id, name)
	if err != nil {
		fmt.Printf("Error updating collection: %v\n", err)
		return err
	}
	return nil
}

func (a *App) DeleteCollection(id string) error {
	err := database.DeleteCollection(id)
	if err != nil {
		fmt.Printf("Error deleting collection: %v\n", err)
		return err
	}
	return nil
}

// ──────────────────────────── Folders ────────────────────────────

func (a *App) CreateFolder(f domain.Folder) error {
	err := database.CreateFolder(f)
	if err != nil {
		fmt.Printf("Error creating folder: %v\n", err)
		return err
	}
	return nil
}

func (a *App) GetFolders(collectionID string) []domain.Folder {
	folders, err := database.GetFolders(collectionID)
	if err != nil {
		fmt.Printf("Error loading folders: %v\n", err)
		return []domain.Folder{}
	}
	return folders
}

func (a *App) RenameFolder(id, name string) error {
	err := database.RenameFolder(id, name)
	if err != nil {
		fmt.Printf("Error renaming folder: %v\n", err)
		return err
	}
	return nil
}

func (a *App) MoveFolder(id, collectionID string, parentFolderID *string) error {
	err := database.MoveFolder(id, collectionID, parentFolderID)
	if err != nil {
		fmt.Printf("Error moving folder: %v\n", err)
		return err
	}
	return nil
}

func (a *App) DeleteFolder(id string) error {
	err := database.DeleteFolder(id)
	if err != nil {
		fmt.Printf("Error deleting folder: %v\n", err)
		return err
	}
	return nil
}

// ──────────────────────────── Saved Requests ────────────────────────────

func (a *App) SaveRequest(r domain.SavedRequest) error {
	err := database.SaveRequest(r)
	if err != nil {
		fmt.Printf("Error saving request: %v\n", err)
		return err
	}
	return nil
}

func (a *App) GetSavedRequests(collectionID string) []domain.SavedRequest {
	requests, err := database.GetSavedRequests(collectionID)
	if err != nil {
		fmt.Printf("Error loading saved requests: %v\n", err)
		return []domain.SavedRequest{}
	}
	return requests
}

func (a *App) DeleteSavedRequest(id string) error {
	err := database.DeleteSavedRequest(id)
	if err != nil {
		fmt.Printf("Error deleting saved request: %v\n", err)
		return err
	}
	return nil
}
