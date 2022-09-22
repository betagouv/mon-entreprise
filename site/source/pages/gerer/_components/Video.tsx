import { useTranslation } from 'react-i18next'

export default function Video() {
	const { i18n } = useTranslation()

	return (
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '0',
				paddingBottom: '56.25%',
			}}
		>
			<iframe
				style={{
					position: 'absolute',
					left: 0,
					width: '100%',
					height: '100%',
				}}
				src={`https://www.youtube-nocookie.com/embed/${
					i18n.language === 'fr' ? 'EMQ3fNyMxBE' : 'dN9ZVazSmpc'
				}?rel=0&amp;showinfo=0;disablekb=1`}
				frameBorder="0"
				allow="autoplay; encrypted-media"
				allowFullScreen
				title={
					i18n.language === 'fr'
						? 'Vidéo Youtube : 3 minutes pour comprendre la Sécurité Sociale'
						: 'Youtube video : 3 minutes to understand the French Social Security system'
				}
			/>
		</div>
	)
}
