import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
	LienVersLaDocumentationProvider,
	useLienVersLaDocumentation,
} from './LienVersLaDocumentationContext'

function TestComponent() {
	const hasLinkToDoc = useLienVersLaDocumentation()

	return <span>{hasLinkToDoc ? 'true' : 'false'}</span>
}

describe('LienVersLaDocumentationContext - useLienVersLaDocumentation', () => {
	it('utilise true comme valeur par défaut', () => {
		render(<TestComponent />)

		expect(screen.getByText('true')).toBeInTheDocument()
	})

	it('transmet true lorsque le Provider reçoit true', () => {
		render(
			<LienVersLaDocumentationProvider lienVersLaDocumentation={true}>
				<TestComponent />
			</LienVersLaDocumentationProvider>
		)

		expect(screen.getByText('true')).toBeInTheDocument()
	})

	it('transmet false lorsque le Provider reçoit false', () => {
		render(
			<LienVersLaDocumentationProvider lienVersLaDocumentation={false}>
				<TestComponent />
			</LienVersLaDocumentationProvider>
		)

		expect(screen.getByText('false')).toBeInTheDocument()
	})

	it('utilise true par défaut lorsque aucune valeur n’est fournie au Provider', () => {
		render(
			<LienVersLaDocumentationProvider>
				<TestComponent />
			</LienVersLaDocumentationProvider>
		)

		expect(screen.getByText('true')).toBeInTheDocument()
	})
})
