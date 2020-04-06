import React from 'react'
import './InfoBulle.css'

export default function InfoBulle({ children }: { children: React.ReactNode }) {
	return (
		<span style={{ position: 'relative', verticalAlign: 'bottom' }}>
			<span className="info-bulle__interrogation-mark" tabIndex={0}>
				?
			</span>
			<span className="info-bulle__text">{children}</span>
		</span>
	)
}
