package app

import (
	"cloudflash-api/database"
	"cloudflash-api/domain"
	"cloudflash-api/services"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) SendRequest(req domain.APIRequest) domain.APIResponse {
	res := services.SendRequest(req)

	go func() {
		err := database.SaveHistory(req.Method, req.URL, req.Body)
		if err != nil {
			fmt.Println(err)
			return
		}

		runtime.EventsEmit(a.ctx, "history_updated")
	}()

	return res
}
