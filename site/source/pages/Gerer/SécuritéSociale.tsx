import { FromBottom } from '@/components/ui/animate'
import { H1 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../ATInternetTracking'
import Video from './Video'

export default function SocialSecurity() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>{t('sécu.page.titre', 'Sécurité sociale')}</title>
			</Helmet>

			<FromBottom>
				<TrackPage name="securite_social" />
				<Trans i18nKey="sécu.contenu">
					<H1>Protection sociale </H1>
					<Body>
						En France, tous les travailleurs bénéficient d'une protection
						sociale de qualité. Ce système obligatoire repose sur la solidarité
						et vise à assurer le{' '}
						<strong>bien-être général de la population</strong>.
					</Body>
					<Body>
						En contrepartie du paiement de{' '}
						<strong>contributions sociales</strong>, le cotisant est couvert sur
						la maladie, les accidents du travail, chômage ou encore la retraite.
					</Body>
				</Trans>

				<section style={{ marginTop: '2rem' }}>
					<Video />
				</section>
			</FromBottom>
		</>
	)
}
