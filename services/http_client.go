package services

import (
	"bytes"
	"cloudflash-api/domain"
	"fmt"
	"io"
	"net/http"
	"time"
)

var httpClient = &http.Client{Timeout: 30 * time.Second}

func SendRequest(req domain.APIRequest) domain.APIResponse {
	start := time.Now()
	requestURL, err := domain.URLWithParams(req.URL, req.Params)
	if err != nil {
		return requestError(err)
	}

	httpReq, err := http.NewRequest(req.Method, requestURL, bytes.NewBuffer([]byte(req.Body)))
	if err != nil {
		return requestError(err)
	}

	for _, header := range req.Headers {
		if header.Key == "" {
			continue
		}

		httpReq.Header.Set(header.Key, header.Value)
	}

	res, err := httpClient.Do(httpReq)
	if err != nil {
		return requestError(err)
	}

	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return requestError(err)
	}

	responseHeaders := make([]domain.ResponseHeader, 0, len(res.Header))
	for key, values := range res.Header {
		value := ""
		if len(values) > 0 {
			value = values[0]
		}

		responseHeaders = append(responseHeaders, domain.ResponseHeader{Key: key, Value: value})
	}

	return domain.APIResponse{
		Status:  res.StatusCode,
		Time:    time.Since(start).Milliseconds(),
		Size:    fmt.Sprintf("%.2fKB", float64(len(bodyBytes))/1024.0),
		Body:    string(bodyBytes),
		Headers: responseHeaders,
	}
}

func requestError(err error) domain.APIResponse {
	return domain.APIResponse{
		Status: 0,
		Body:   err.Error(),
		Time:   0,
		Size:   "0B",
	}
}
