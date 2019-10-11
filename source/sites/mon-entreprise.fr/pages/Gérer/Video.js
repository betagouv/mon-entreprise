import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Video() {
	const { i18n } = useTranslation()

	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '0',
				paddingBottom: '56.25%'
			}}>
			<iframe
				style={{
					position: 'absolute',
					left: 0,
					width: '100%',
					height: '100%'
				}}
				src={`https://www.youtube-nocookie.com/embed/${
					i18n.language === 'fr' ? 'EMQ3fNyMxBE' : 'dN9ZVazSmpc'
				}?rel=0&amp;showinfo=0`}
				frameBorder="0"
				allow="autoplay; encrypted-media"
				allowFullScreen
			/>
		</div>
	)
}
