import { Helmet } from 'react-helmet'

type PropType = {
	title: string
	description?: string
}

export default function Meta({ title, description }: PropType) {
	return (
		<Helmet>
			<title>{title}</title>
			<meta property="og:type" content="article" />
			<meta property="og:title" content={title} />
			{description && <meta property="og:description" content={description} />}
			{description && <meta name="description" content={description} />}
		</Helmet>
	)
}
