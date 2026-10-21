package sharedtypes

import (
	"encoding/json"
	"math"
	"testing"
)

func TestCalculateVat(t *testing.T) {
	if got := CalculateVat(100); math.Abs(got-7) > 1e-9 {
		t.Errorf("CalculateVat(100) = %v, want 7", got)
	}
}

func TestFormatBaht(t *testing.T) {
	cases := map[float64]string{
		0:          "฿0.00",
		5:          "฿5.00",
		1234.5:     "฿1,234.50",
		1234567.89: "฿1,234,567.89",
		-1000:      "-฿1,000.00",
	}
	for in, want := range cases {
		if got := FormatBaht(in); got != want {
			t.Errorf("FormatBaht(%v) = %q, want %q", in, got, want)
		}
	}
}

func TestProductJSON(t *testing.T) {
	b, err := json.Marshal(Product{ID: 1, Name: "Pen", Price: 10, InStock: true})
	if err != nil {
		t.Fatal(err)
	}
	want := `{"id":1,"name":"Pen","price":10,"inStock":true}`
	if string(b) != want {
		t.Errorf("json = %s, want %s", b, want)
	}
}
