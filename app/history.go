package app

import (
	"cloudflash-api/database"
	"cloudflash-api/domain"
	"fmt"
)

func (a *App) GetHistory() []domain.HistoryItem {
	history, err := database.GetHistory()
	if err != nil {
		fmt.Println(err)
		return []domain.HistoryItem{}
	}

	return history
}

func (a *App) DeleteHistoryItem(id int) {
	err := database.DeleteHistoryItem(id)
	if err != nil {
		fmt.Println(err)
	}
}
