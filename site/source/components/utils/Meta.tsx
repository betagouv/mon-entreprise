import DefaultHelmet from './DefaultHelmet'

type PropType = {
	title: string
	description: string
	ogDescription?: string
	ogTitle?: string
	ogImage?: string
}

export default function Meta({
	title,
	description,
	ogDescription,
	ogTitle,
	ogImage,
}: PropType) {
	return (
		<DefaultHelmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={ogTitle || title} />
			<meta property="og:description" content={ogDescription || description} />
			{ogImage && (
				<meta
					property="og:image"
					content={
						ogImage.startsWith('http')
							? ogImage
							: (typeof window !== 'undefined' ? window.location.host : '') +
							  ogImage
					}
				/>
			)}
		</DefaultHelmet>
	)
}
