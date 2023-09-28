import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

type PropType = {
	title: string
	description: string
	ogDescription?: string
	ogTitle?: string
	ogImage?: string
}

/**
 * Sets the meta tags for the page. If you want to change just a value like
 *  title or description in sub-pages then you can use the Helmet component directly,
 * example : `<Helmet title='...' />` or
 * `<Helmet> <title>...</title> <meta name="description" content="..." /> </Helmet>`
 */
export default function Meta({
	title,
	description,
	ogDescription,
	ogTitle,
	ogImage,
}: PropType) {
	const { t, i18n } = useTranslation()

	return (
		<Helmet
			defaultTitle={t('site.defaultTitle', 'Mon-entreprise')}
			titleTemplate={t('site.titleTemplate', '%s - Mon-entreprise')}
			title={title}
		>
			<meta property="og:type" content="website" />
			<meta
				name="description"
				content={
					description ??
					t(
						'site.meta.description',
						'Des simulateurs et assistants pour développer votre activité'
					)
				}
			/>
			<meta
				property="og:title"
				content={
					ogTitle ??
					title ??
					t(
						'site.meta.og:title',
						'mon-entreprise.urssaf.fr : Simulateurs et assistants pour développer votre activité'
					)
				}
			/>
			<meta
				property="og:description"
				content={
					ogDescription ??
					description ??
					t(
						'site.meta.og:description',
						"Une collection d'assistants et de simulateurs crées par l'Urssaf pour vous accompagner dans le développement de votre activité"
					)
				}
			/>
			<meta
				property="og:image"
				content={
					ogImage ??
					(i18n.language === 'fr'
						? '/assets/images/logo-monentreprise.svg'
						: '/assets/images/logo-mycompany-share.svg')
				}
			/>
		</Helmet>
	)
}
