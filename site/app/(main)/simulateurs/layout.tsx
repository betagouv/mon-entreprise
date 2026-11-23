'use client'

import { ReactNode } from 'react'

import { LienDeRetour } from '@/simulateurs'

export default function SimulateursLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<>
			<LienDeRetour />
			{children}
		</>
	)
}
