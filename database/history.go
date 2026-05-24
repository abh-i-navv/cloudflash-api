package database

type HistoryItem struct {
	ID        int    `json:"id"`
	Method    string `json:"method"`
	URL       string `json:"url"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
}

func SaveHistory(method, url, body string) error {
	query := `
	INSERT INTO request_history(method,url,body)
	VALUES (?, ? , ?)
	`
	_, err := DB.Exec(query, method, url, body)

	return err
}

func GetHistory() ([]HistoryItem, error) {
	query := `
	SELECT id, method, url, body, created_at
	FROM request_history
	ORDER BY created_at DESC
	LIMIT 100
	`

	rows, err := DB.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var history []HistoryItem

	for rows.Next() {
		var item HistoryItem

		err := rows.Scan(&item.ID, &item.Method, &item.URL, &item.Body, &item.CreatedAt)

		if err != nil {
			return nil, err
		}

		history = append(history, item)
	}

	// Ensure an empty array instead of nil is returned
	if history == nil {
		history = []HistoryItem{}
	}

	return history, nil
}

func DeleteHistoryItem(id int) error {
	query := `
	DELETE FROM request_history
	WHERE id = ?
	`
	_, err := DB.Exec(query, id)
	return err
}
