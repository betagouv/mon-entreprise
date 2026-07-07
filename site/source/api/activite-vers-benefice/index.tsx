export type Bénéfice = 'BIC' | 'BA' | 'BIC/BNC' | 'BNC' | undefined

export default async function fetchBénéfice(
	activité: string
): Promise<Bénéfice> {
	const data = (await import('./data')).default

	return data[activité as keyof typeof data] as Bénéfice
}
