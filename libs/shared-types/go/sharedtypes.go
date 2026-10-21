package sharedtypes

import (
	"fmt"
	"math"
	"strings"
)

const VatRate = 0.07

func SharedTypes() string {
	return "shared-types"
}

type Product struct {
	ID      int     `json:"id"`
	Name    string  `json:"name"`
	Price   float64 `json:"price"`
	InStock bool    `json:"inStock"`
}

func CalculateVat(price float64) float64 {
	return price * VatRate
}

// Mirrors Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }) output.
func FormatBaht(price float64) string {
	sign := ""
	if price < 0 {
		sign = "-"
	}

	intPart, fracPart, _ := strings.Cut(fmt.Sprintf("%.2f", math.Abs(price)), ".")

	var b strings.Builder
	for i, c := range intPart {
		if i > 0 && (len(intPart)-i)%3 == 0 {
			b.WriteByte(',')
		}
		b.WriteRune(c)
	}

	return sign + "฿" + b.String() + "." + fracPart
}
