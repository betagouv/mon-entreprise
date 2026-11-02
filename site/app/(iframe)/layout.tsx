import { ReactNode } from 'react'

import { OuvreLesLiensDansLaPageParente } from '@/components/layout/OuvreLesLiensDansLaPageParente'

export default function IframeLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<OuvreLesLiensDansLaPageParente />
			{children}
		</>
	)
}
