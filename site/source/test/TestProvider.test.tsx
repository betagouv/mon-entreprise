import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { applicationLanguage } from '@/services/applicationLanguage'

import { TestProvider } from './TestProvider'

const LangueLue = () => <p>{applicationLanguage()}</p>

describe('TestProvider', () => {
	it('déclare la langue de l’application, celle que lisent les moteurs', () => {
		render(
			<TestProvider langue="en">
				<LangueLue />
			</TestProvider>
		)

		expect(screen.getByText('en')).toBeInTheDocument()
	})

	it('rend sa langue d’origine à l’application quand il disparaît', () => {
		const { unmount } = render(
			<TestProvider langue="en">
				<LangueLue />
			</TestProvider>
		)

		unmount()

		expect(applicationLanguage()).toBe('fr')
	})
})
