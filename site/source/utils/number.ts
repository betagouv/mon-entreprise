import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'

export const round = (number: number, precision = 0) =>
	Math.round(number * 10 ** precision) / 10 ** precision

/**
 * Calcule des pourcentages dont la somme vaut exactement 100.
 * Chaque pourcentage est arrondi à 1 décimale.
 */
export const roundedPercentages = <K extends string>(
	values: Record<K, number>
): Record<string, number> => {
	const total = getTotal(values)
	const pourcentages = R.map(values, (v) => (v / total) * 100)

	// 2️⃣ Arrondi à 1 décimale
	const arrondis = R.map(pourcentages, (v) => round(v, 1))
	const totalArrondis = getTotal(arrondis)

	if (totalArrondis === 100) {
		return arrondis
	}

	const écart = round(100 - totalArrondis, 1)
	// 4️⃣ Classe les clés selon la distance à l’arrondi supérieur (pour +) ou inférieur (pour -)
	const pourcentagesTriés = pipe(
		pourcentages,
		R.toEntries,
		A.map(([index, pourcentage]) => ({
			index,
			pourcentage,
			// distance à l’arrondi supérieur / inférieur
			deltaSup: Math.ceil(pourcentage * 10) / 10 - pourcentage,
			deltaInf: pourcentage - Math.floor(pourcentage * 10) / 10,
		}))
	).sort((a, b) =>
		écart > 0 ? a.deltaSup - b.deltaSup : b.deltaInf - a.deltaInf
	)

	// 5️⃣ Applique les ajustements de 0,1% tant qu’il reste une différence
	let écartRestant = écart
	const result = { ...arrondis }

	for (const { index } of pourcentagesTriés) {
		if (Math.abs(écartRestant) < 1e-9) {
			break
		}
		const pas = écart > 0 ? 0.1 : -0.1
		const nouvelleValeur = Math.round((result[index] + pas) * 10) / 10
		if (nouvelleValeur >= 0 && nouvelleValeur <= 100) {
			result[index] = nouvelleValeur
			écartRestant = Math.round((écartRestant - pas) * 10) / 10
		}
	}

	return result
}

const getTotal = (values: Record<string, number>): number => {
	const sum = (a = 0, b: number) => a + b

	return pipe(values, R.values, A.reduce(0, sum))
}
