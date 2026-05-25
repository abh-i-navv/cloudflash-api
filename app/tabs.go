package app

import (
	"cloudflash-api/database"
	"cloudflash-api/domain"
	"fmt"
)

// save tabs exposed to frontend
func (a *App) SaveTabs(tabs []domain.Tab) error {
	err := database.SaveTabs(tabs)

	if err != nil {
		fmt.Printf("Error saving tabs: %v\n", err)
		return err
	}
	return nil
}

// get tabs exposed to frontend
func (a *App) GetTabs() []domain.Tab {
	tabs, err := database.GetTabs()
	if err != nil {
		fmt.Printf("Error loading tabs: %v\n", err)
		return []domain.Tab{}
	}
	return tabs
}
