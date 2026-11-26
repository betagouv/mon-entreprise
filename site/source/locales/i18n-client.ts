'use client'

import { useState } from 'react'
import { initReactI18next } from 'react-i18next'

import { buildTimeCatalog } from './buildTimeCatalog'
import { setAppLanguage } from './i18n'
import { AvailableLang } from './langue'

export const useClientI18n = (langue: AvailableLang) => {
	const [i18n] = useState(() =>
		setAppLanguage(langue, {
			catalog: buildTimeCatalog,
			plugins: [initReactI18next],
		})
	)

	return i18n
}
