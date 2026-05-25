package domain

import "net/url"

type Header struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Param struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type APIRequest struct {
	Method string `json:"method"`
	URL    string `json:"url"`
	Body   string `json:"body"`

	Headers []Header `json:"headers"`
	Params  []Param  `json:"params"`
}

type ResponseHeader struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type APIResponse struct {
	Status  int              `json:"status"`
	Time    int64            `json:"time"`
	Size    string           `json:"size"`
	Body    string           `json:"body"`
	Headers []ResponseHeader `json:"headers"`
}

func URLWithParams(rawURL string, params []Param) (string, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	query := parsedURL.Query()
	for _, param := range params {
		if param.Key == "" {
			continue
		}

		query.Set(param.Key, param.Value)
	}

	parsedURL.RawQuery = query.Encode()
	return parsedURL.String(), nil
}
