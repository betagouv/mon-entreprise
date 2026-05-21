import { cookies } from 'next/headers'
import { ReactNode } from 'react'

import { langue } from '@/locales/i18n-server'
import {
	DARK_MODE_STORAGE_KEY,
	parseDarkModeValue,
} from '@/storage/darkModeStorage'

import { ClientProviders } from './ClientProviders'

export async function Providers({ children }: { children: ReactNode }) {
	const cookieStore = await cookies()
	const darkModeParDéfaut = parseDarkModeValue(
		cookieStore.get(DARK_MODE_STORAGE_KEY)?.value
	)

	return (
		<ClientProviders
			darkModeParDéfaut={darkModeParDéfaut}
			langueParDéfaut={langue}
		>
			{children}
		</ClientProviders>
	)
}
