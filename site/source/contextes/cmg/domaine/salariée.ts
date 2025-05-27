export type Salariée = SalariéeAMA | SalariéeGED

export interface SalariéeAMA {
	type: 'AMA'
	salaireNet: number
	indemnitésEntretien: number
	fraisDeRepas: number
}

interface SalariéeGED {
	type: 'GED'
	salaireNet: number
}
