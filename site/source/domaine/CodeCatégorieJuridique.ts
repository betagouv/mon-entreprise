import { Brand } from '@/domaine/Brand'

export type CodeCatégorieJuridique = Brand<string, 'CodeCatégorieJuridique'>

export const codeCatégorieJuridique = (code: string) =>
	code as CodeCatégorieJuridique
