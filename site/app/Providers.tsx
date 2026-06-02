import { ReactNode } from 'react'

import { langue } from '@/locales/i18n-server'

import { ClientProviders } from './ClientProviders'

export function Providers({ children }: { children: ReactNode }) {
	return <ClientProviders langueParDéfaut={langue}>{children}</ClientProviders>
}
