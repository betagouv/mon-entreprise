import { cookies } from 'next/headers'
import { ReactNode } from 'react'

import {
	DARK_MODE_STORAGE_KEY,
	parseDarkModeValue,
} from '@/components/utils/darkModeStorage'

import { ClientProviders } from './ClientProviders'

export async function Providers({ children }: { children: ReactNode }) {
	const cookieStore = await cookies()
	const initialDarkMode = parseDarkModeValue(
		cookieStore.get(DARK_MODE_STORAGE_KEY)?.value
	)

	return (
		<ClientProviders initialDarkMode={initialDarkMode}>
			{children}
		</ClientProviders>
	)
}
