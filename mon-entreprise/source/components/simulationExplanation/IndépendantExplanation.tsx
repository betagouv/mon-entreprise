import Value, { Condition } from 'Components/EngineValue'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import Emoji from 'Components/utils/Emoji'
import { EngineContext } from 'Components/utils/EngineContext'
import assuranceMaladieSrc from 'Images/assurance-maladie.svg'
import * as logosSrc from 'Images/logos-cnavpl'
import urssafSrc from 'Images/urssaf.svg'
import * as Animate from 'Components/ui/animate'
import { default as React, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DottedName } from 'Rules/'
import styled from 'styled-components'
export default function IndépendantExplanation() {
	const engine = useContext(EngineContext)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<Condition expression="entreprise . catégorie d'activité . libérale règlementée">
				<PLExplanation />
			</Condition>
			<h2>Répartition de la rémunération totale</h2>
			<StackedBarChart
				data={[
					{
						...engine.evaluate('revenu net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{ ...engine.evaluate('impôt'), color: palettes[1][0] },
					{
						...engine.evaluate(
							'dirigeant . indépendant . cotisations et contributions'
						),
						title: t('Cotisations'),
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}

function PLExplanation() {
	return (
		<Trans i18nKey="simulateurs.explanation.pamc">
			<Animate.fromBottom>
				<h2>Vos institutions partenaires</h2>
				<div className="ui__ box-container">
					<div className="ui__  card box">
						<a target="_blank" href="https://www.urssaf.fr/portail/home.html">
							<LogoImg src={urssafSrc} title="logo Urssaf" />
						</a>
						<p
							className="ui__ notice"
							css={`
								flex: 1;
							`}
						>
							Les cotisations recouvrées par l'Urssaf, qui servent au
							financement de la sécurité sociale (assurance maladie, allocations
							familiales, dépendance)
						</p>
						<p className="ui__ lead">
							<Value expression="dirigeant . indépendant . PL . cotisations Urssaf" />
						</p>
					</div>
					<CaisseRetraite />
					<Condition expression="dirigeant . indépendant . PL . PAMC . participation CPAM > 0">
						<div className="ui__  card box">
							<a
								target="_blank"
								href="https://www.urssaf.fr/portail/home/praticien-et-auxiliaire-medical/mes-cotisations/le-calcul-de-mes-cotisations/la-participation-de-la-cpam-a-me.html"
							>
								<LogoImg src={assuranceMaladieSrc} title="Logo CPAM" />
							</a>
							<p
								className="ui__ notice"
								css={`
									flex: 1;
								`}
							>
								En tant que professionnel de santé conventionné, vous bénéficiez
								d'une prise en charge d'une partie de vos cotisations par
								l'Assurance Maladie.
							</p>
							<p className="ui__ lead">
								<Emoji emoji="🎁" />{' '}
								<Value expression="dirigeant . indépendant . PL . PAMC . participation CPAM" />
							</p>
						</div>
					</Condition>
				</div>
			</Animate.fromBottom>
		</Trans>
	)
}

function CaisseRetraite() {
	const engine = useContext(EngineContext)
	return (
		<>
			{['CARCDSF', 'CARPIMKO', 'CIPAV', 'CARMF'].map(caisse => {
				const dottedName: DottedName = `dirigeant . indépendant . PL . ${caisse}`
				const { description, références } = engine.evaluate(dottedName)
				return (
					<Condition expression={dottedName}>
						<div className="ui__  card box">
							<a
								target="_blank"
								href={références && Object.values(références)[0]}
							>
								<LogoImg src={logosSrc[caisse]} title={`logo ${caisse}`} />
							</a>
							<p
								className="ui__ notice"
								css={`
									flex: 1;
								`}
							>
								{description}{' '}
								<Trans i18nKey="simulateurs.explanation.CNAPL">
									Elle recouvre les cotisations liées à votre retraite et au
									régime d'invalidité-décès.
								</Trans>
							</p>

							<p className="ui__ lead">
								<Value expression="dirigeant . indépendant . PL . cotisations caisse de retraite" />
							</p>
						</div>
					</Condition>
				)
			})}
		</>
	)
}

const LogoImg = styled.img`
	padding: 1rem;
	height: 5rem;
`
