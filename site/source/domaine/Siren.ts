import { Brand } from '@/domaine/Brand'

export type Siren = Brand<string, 'Siren'>
export const siren = (value: string): Siren => value as Siren

export type Siret = Brand<string, 'Siret'>
export const siret = (value: string): Siret => value as Siret
