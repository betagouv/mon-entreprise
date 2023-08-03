import { useMemo } from 'react'

import { Data, isDataStacked } from './Chart'
import { Visites } from './useStatistiques'

export function useTotals(visits: Visites): number | Record<string, number> {
	return useMemo(() => computeTotals(visits), [visits])
}

const computeTotals = (
	data: Data<number> | Data<Record<string, number>>
): number | Record<string, number> => {
	return isDataStacked(data)
		? data
				.map((d) => d.nombre)
				.reduce(
					(acc, record) =>
						[...Object.entries(acc), ...Object.entries(record)].reduce(
							(merge, [key, value]) => {
								return { ...merge, [key]: (acc[key] ?? 0) + value }
							},
							{}
						),
					{}
				)
		: data.map((d) => d.nombre).reduce((a, b) => a + b, 0)
}
