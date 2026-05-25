package domain

type Tab struct {
	ID string `json:"id"`

	Title string `json:"title"`

	Method string `json:"method"`
	URL    string `json:"url"`

	Body string `json:"body"`

	Headers []Header `json:"headers"`
	Params  []Param  `json:"params"`

	Response APIResponse `json:"response"`

	Position int `json:"position"`

	IsActive bool `json:"is_active"`

	CreatedAt int64 `json:"created_at"`
	UpdatedAt int64 `json:"updated_at"`
}
