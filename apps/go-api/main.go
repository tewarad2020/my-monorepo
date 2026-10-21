package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	sharedtypes "my-monorepo.local/shared-types"
)

type GoResponse struct {
	Message string `json:"message"`
	Source  string `json:"source"`
}

type ProductResponse struct {
	sharedtypes.Product
	Vat        float64 `json:"vat"`
	TotalPrice float64 `json:"totalPrice"`
}

func main() {
	// ตั้งค่า Route สำหรับแอป Go
	// http.HandleFunc("/go-api", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Set("Content-Type", "application/json")

	// 	res := GoResponse{
	// 		Message: "Hello from Go Backend! 🐹",
	// 		Source:  "Golang",
	// 	}
	// 	json.NewEncoder(w).Encode(res)
	// })

	http.HandleFunc("/go-api", func(w http.ResponseWriter, r *http.Request) {
		const basePrice = 3500.0
		vat := sharedtypes.CalculateVat(basePrice)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ProductResponse{
			Product: sharedtypes.Product{
				ID:      101,
				Name:    "Monorepo Mechanical Keyboard",
				Price:   basePrice,
				InStock: true,
			},
			Vat:        vat,
			TotalPrice: basePrice + vat,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Listening at http://localhost:%s/api", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
