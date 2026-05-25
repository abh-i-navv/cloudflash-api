package domain

type HistoryItem struct {
	ID        int    `json:"id"`
	Method    string `json:"method"`
	URL       string `json:"url"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
}
