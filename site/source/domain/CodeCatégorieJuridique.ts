import { Brand } from '@/domain/Brand'

export type CodeCatégorieJuridique = Brand<string, 'CodeCatégorieJuridique'>

export const codeCatégorieJuridique = (code: string) =>
	code as CodeCatégorieJuridique
