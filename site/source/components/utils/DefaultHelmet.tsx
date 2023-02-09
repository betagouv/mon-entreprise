import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

type Props = {
	children: ReactNode
}

const DefaultHelmet = ({ children }: Props) => {
	const { t } = useTranslation()

	return (
		<Helmet
			defaultTitle={t('site.defaultTitle', 'Mon-entreprise')}
			titleTemplate={t('site.titleTemplate', '%s - Mon-entreprise')}
		>
			{children}
		</Helmet>
	)
}

export default DefaultHelmet
