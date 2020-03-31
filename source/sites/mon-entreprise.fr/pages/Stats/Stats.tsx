import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import emoji from 'react-easy-emoji'

export default function Stats() {
	return (
		<>
			<ScrollToTop />
			<h1>
				Statistiques <>{emoji('📊')}</>
			</h1>
		</>
	)
}
