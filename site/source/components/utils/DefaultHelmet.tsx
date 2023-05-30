import { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

type Props = {
	children: ReactNode
}

const DefaultHelmet = ({ children }: Props) => {
	const { t, i18n } = useTranslation()

	return (
		<Helmet
			defaultTitle={t('site.defaultTitle', 'Mon-entreprise')}
			titleTemplate={t('site.titleTemplate', '%s - Mon-entreprise')}
		>
			<meta property="og:type" content="website" />
			<meta
				name="description"
				content={t(
					'site.meta.description',
					'Des simulateurs et assistants pour développer votre activité'
				)}
			/>
			<meta
				property="og:title"
				content={t(
					'site.meta.og:title',
					'mon-entreprise.urssaf.fr : Simulateurs et assistants pour développer votre activité'
				)}
			/>
			<meta
				property="og:description"
				content={t(
					'site.meta.og:description',
					"Une collection d'assistants et de simulateurs crées par l'Urssaf pour vous accompagner dans le développement de votre activité"
				)}
			/>
			<meta
				property="og:image"
				content={
					i18n.language === 'fr'
						? '/assets/images/logo-monentreprise.svg'
						: '/assets/images/logo-mycompany-share.svg'
				}
			/>

			{children}
		</Helmet>
	)
}

export default DefaultHelmet
