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
	const siteUrl = 'https://mon-entreprise.urssaf.fr'
    const defaultImage = '/images/og/default.png'

	const relativeOgImage =
	ogImage ??
	(i18n.language === 'fr'
		? defaultImage
		: defaultImage)

    const absoluteOgImage = relativeOgImage.startsWith('http')
	? relativeOgImage
	: `${siteUrl}${relativeOgImage}`



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
			<meta property="og:image" content={absoluteOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
			
			<meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={absoluteOgImage} />


		</Helmet>
	)
}
