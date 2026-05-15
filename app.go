package main

import (
	"bytes"
	"cloudflash-api/database"
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	_ "github.com/wailsapp/wails/runtime"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	_ "github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// global http client
var httpClient = &http.Client{Timeout: 30 * time.Second}

func (a *App) SendRequest(req APIRequest) APIResponse {
	start := time.Now()

	httpReq, err := http.NewRequest(req.Method, req.URL, bytes.NewBuffer(([]byte(req.Body))))

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
			Time:   0,
			Size:   "0B",
		}
	}

	for _, header := range req.Headers {
		if header.Key == "" {
			continue
		}

		httpReq.Header.Set(header.Key, header.Value)
	}

	// httpClient := &http.Client{Timeout: 30 * time.Second}

	res, err := httpClient.Do(httpReq)

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
			Time:   0,
			Size:   "0B",
		}
	}

	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
			Time:   0,
			Size:   "0B",
		}
	}

	bodyString := string(bodyBytes)

	var responseHeaders []ResponseHeader

	for key, values := range res.Header {
		value := ""

		if len(values) > 0 {
			value = values[0]
		}
		responseHeaders = append(responseHeaders,
			ResponseHeader{Key: key, Value: value})
	}

	elapsed := time.Since(start)

	// go routine for saving the request in database and making the app faster
	go func() {
		err := database.SaveHistory(req.Method, req.URL, req.Body)
		if err != nil {
			fmt.Println(err)
			return
		}

		runtime.EventsEmit(a.ctx, "history_updated")
	}()

	return APIResponse{
		Status:  res.StatusCode,
		Time:    elapsed.Milliseconds(),
		Size:    fmt.Sprintf("%.2fKB", float64(len(bodyBytes))/1024.0),
		Body:    bodyString,
		Headers: responseHeaders,
	}
}

func (a *App) GetHistory() []database.HistoryItem {
	history, err := database.GetHistory()

	if err != nil {
		fmt.Println(err)

		return []database.HistoryItem{}
	}
	return history
}

func (a *App) DeleteHistoryItem(id int) {
	err := database.DeleteHistoryItem(id)

	if err != nil {
		fmt.Println(err)
	}
}
