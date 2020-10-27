import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import animate from 'Components/ui/animate'

export default function SchemeChoice() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<animate.fromBottom>
			<Helmet>
				<title>{t('selectionRégime.page.titre', 'Selection du régime')}</title>
			</Helmet>
			<h1>
				<Trans i18nKey="selectionRégime.titre">
					Quel régime souhaitez-vous explorer ?
				</Trans>
			</h1>
			<p>
				<Link
					to={sitePaths.simulateurs.SASU}
					className="ui__ interactive card light-bg button-choice"
				>
					{emoji('☂')}
					<span>
						<Trans>Assimilé salarié</Trans>
						<small>
							(
							<Trans i18nKey="comparaisonRégimes.status.AS">
								SAS, SASU ou SARL avec gérant minoritaire
							</Trans>
							)
						</small>
					</span>
				</Link>
				<Link
					to={sitePaths.simulateurs.indépendant}
					className="ui__ interactive card light-bg button-choice"
				>
					{emoji('👩‍🔧')}
					<span>
						<Trans>Indépendant</Trans>
						<small>
							(
							<Trans i18nKey="comparaisonRégimes.status.indep.1">
								EI, EIRL, EURL ou SARL avec gérant majoritaire
							</Trans>
							)
						</small>
					</span>
				</Link>
				<Link
					to={sitePaths.simulateurs['auto-entrepreneur']}
					className="ui__ interactive card light-bg button-choice"
				>
					{emoji('🚶‍♂️')}
					Auto-entrepreneur
				</Link>
			</p>
			<h2>
				<Trans i18nKey="selectionRégime.comparer.titre">
					Vous ne savez pas lequel choisir ?
				</Trans>
			</h2>
			<p style={{ textAlign: 'center', marginTop: '1rem' }}>
				<Link
					className="ui__  plain cta button"
					to={sitePaths.simulateurs.comparaison}
				>
					<Trans i18nKey="selectionRégime.comparer.cta">
						Comparer les régimes
					</Trans>
				</Link>
			</p>
		</animate.fromBottom>
	)
}
