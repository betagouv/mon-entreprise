import { useContext } from 'react'
import { RenderersContext } from '../contexts'

type PropType = {
	title: string
	description?: string
}

export default function Meta({ title, description }: PropType) {
	const { Head } = useContext(RenderersContext)
	if (!Head) {
		return null
	}
	return (
		<Head>
			<title>{title}</title>
			<meta property="og:type" content="article" />
			<meta property="og:title" content={title} />
			{description && <meta property="og:description" content={description} />}
			{description && <meta name="description" content={description} />}
		</Head>
	)
}
