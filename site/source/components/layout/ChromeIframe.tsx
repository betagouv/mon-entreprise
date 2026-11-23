'use client'

import { ReactNode } from 'react'

import IframeFooter from '@/components/layout/IframeFooter'

type Props = {
	children: ReactNode
	avecAvis?: boolean
	avecLogo?: boolean
}

export function ChromeIframe({
	children,
	avecAvis = false,
	avecLogo = false,
}: Props) {
	return (
		<>
			{children}
			<IframeFooter avecAvis={avecAvis} avecLogo={avecLogo} />
		</>
	)
}
