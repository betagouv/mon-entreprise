export const getCurrentYear = () => {
	return new Date().getFullYear()
}

export const getYearsBetween = (
	startYear: number,
	currentYear: number
): number[] => {
	return Array.from(
		{ length: currentYear - startYear + 1 },
		(_, i) => startYear + i
	)
}
