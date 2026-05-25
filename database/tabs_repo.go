package database

import (
	"cloudflash-api/domain"
	"encoding/json"
)

// SaveTabs saves the entire slice of tabs within a single SQLite transaction
func SaveTabs(tabs []domain.Tab) error {
	tx, err := DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Clear existing tabs
	_, err = tx.Exec("DELETE FROM tabs")
	if err != nil {
		return err
	}

	// Insert current tabs preserving their order
	query := `
	INSERT INTO tabs (id, title, method, url, body, headers, params, response, position, is_active, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	stmt, err := tx.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for i, tab := range tabs {
		headersJSON, err := json.Marshal(tab.Headers)
		if err != nil {
			return err
		}
		paramsJSON, err := json.Marshal(tab.Params)
		if err != nil {
			return err
		}
		responseJSON, err := json.Marshal(tab.Response)
		if err != nil {
			return err
		}

		_, err = stmt.Exec(
			tab.ID,
			tab.Title,
			tab.Method,
			tab.URL,
			tab.Body,
			string(headersJSON),
			string(paramsJSON),
			string(responseJSON),
			i, // position
			tab.IsActive,
			tab.CreatedAt,
			tab.UpdatedAt,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

// GetTabs retrieves all tabs ordered by their positions
func GetTabs() ([]domain.Tab, error) {
	query := `
	SELECT id, title, method, url, body, headers, params, response, position, is_active, created_at, updated_at
	FROM tabs
	ORDER BY position ASC
	`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tabs []domain.Tab
	for rows.Next() {
		var tab domain.Tab
		var headersStr, paramsStr, responseStr string
		err := rows.Scan(
			&tab.ID,
			&tab.Title,
			&tab.Method,
			&tab.URL,
			&tab.Body,
			&headersStr,
			&paramsStr,
			&responseStr,
			&tab.Position,
			&tab.IsActive,
			&tab.CreatedAt,
			&tab.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal([]byte(headersStr), &tab.Headers); err != nil {
			tab.Headers = []domain.Header{}
		}
		if err := json.Unmarshal([]byte(paramsStr), &tab.Params); err != nil {
			tab.Params = []domain.Param{}
		}
		if err := json.Unmarshal([]byte(responseStr), &tab.Response); err != nil {
			tab.Response = domain.APIResponse{}
		}

		tabs = append(tabs, tab)
	}

	if tabs == nil {
		tabs = []domain.Tab{}
	}
	return tabs, nil
}
