package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"time"
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

func (a *App) SendRequest(req APIRequest) APIResponse {
	start := time.Now()

	httpReq, err := http.NewRequest(req.Method, req.URL, bytes.NewBuffer(([]byte(req.Body))))

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
		}
	}

	for _, header := range req.Headers {
		if header.Key == "" {
			continue
		}

		httpReq.Header.Set(header.Key, header.Value)
	}

	client := &http.Client{Timeout: 30 * time.Second}

	res, err := client.Do(httpReq)

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
		}
	}

	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)

	if err != nil {
		return APIResponse{
			Status: 0,
			Body:   err.Error(),
		}
	}

	bodyString := string(bodyBytes)

	var responseHeaders []ResponseHeader

	for key, values := range res.Header {
		responseHeaders = append(responseHeaders,
			ResponseHeader{Key: key, Value: values[0]})
	}

	elapsed := time.Since(start)

	return APIResponse{
		Status: res.StatusCode,
		Time:   elapsed.Milliseconds(),
		Size:   fmt.Sprintf("%.2fKB", float64(len(bodyBytes))/1024.0),
		Body:   bodyString,
		Headrs: responseHeaders,
	}
}
