import { Brand } from '@/domain/Brand'

export type CodeActivite = Brand<string, 'CodeActivite'>
// Pourrait être inféré des données de fetchBénéfice

export const codeActivité = (code: string) => code as CodeActivite
