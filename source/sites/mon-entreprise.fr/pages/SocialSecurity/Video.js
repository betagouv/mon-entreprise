import withLanguage from 'Components/utils/withLanguage'
import React from 'react'

export default withLanguage(function Video({ language }) {
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
					language === 'fr' ? 'EMQ3fNyMxBE' : 'dN9ZVazSmpc'
				}?rel=0&amp;showinfo=0`}
				frameBorder="0"
				allow="autoplay; encrypted-media"
				allowFullScreen
			/>
		</div>
	)
})
