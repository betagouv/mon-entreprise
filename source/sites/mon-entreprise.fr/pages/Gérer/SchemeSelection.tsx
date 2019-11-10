import { T } from 'Components'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import animate from 'Ui/animate'

export default function SchemeChoice() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	return (
		<animate.fromBottom>
			<Helmet>
				<title>{t('selectionRégime.page.titre', 'Selection du régime')}</title>
			</Helmet>
			<h1>
				<T k="selectionRégime.titre">Quel régime souhaitez-vous explorer ?</T>
			</h1>
			<p>
				<Link
					to={sitePaths.simulateurs['assimilé-salarié']}
					className="ui__ interactive card light-bg button-choice"
				>
					{emoji('☂')}
					<span>
						<T>Assimilé salarié</T>
						<small>
							(
							<T k="comparaisonRégimes.status.AS">
								SAS, SASU ou SARL avec gérant minoritaire
							</T>
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
						<T>Indépendant</T>
						<small>
							(
							<T k="comparaisonRégimes.status.indep.1">
								EI, EIRL, EURL ou SARL avec gérant majoritaire
							</T>
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
				<T k="selectionRégime.comparer.titre">
					Vous ne savez pas lequel choisir ?
				</T>
			</h2>
			<p style={{ textAlign: 'center', marginTop: '1rem' }}>
				<Link
					className="ui__  plain cta button"
					to={sitePaths.simulateurs.comparaison}
				>
					<T k="selectionRégime.comparer.cta">Comparer les régimes</T>
				</Link>
			</p>
		</animate.fromBottom>
	)
}
