import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import * as Animate from 'Components/ui/animate'
import Video from './Video'

export default function SocialSecurity() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>{t('sécu.page.titre', 'Sécurité sociale')}</title>
			</Helmet>

			<Animate.fromBottom>
				<Trans i18nKey="sécu.contenu">
					<h1>Protection sociale </h1>
					<p>
						En France, tous les travailleurs bénéficient d'une protection
						sociale de qualité. Ce système obligatoire repose sur la solidarité
						et vise à assurer le{' '}
						<strong>bien-être général de la population</strong>.
					</p>
					<p>
						En contrepartie du paiement de{' '}
						<strong>contributions sociales</strong>, le cotisant est couvert sur
						la maladie, les accidents du travail, chômage ou encore la retraite.
					</p>
				</Trans>

				<section style={{ marginTop: '2rem' }}>
					<Video />
				</section>
			</Animate.fromBottom>
		</>
	)
}
