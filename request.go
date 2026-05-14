package main

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
	Status int              `json:"status"`
	Time   int64            `json:"time"`
	Size   string           `json:"size"`
	Body   string           `jsong:"body"`
	Headrs []ResponseHeader `json:"headers"`
}
