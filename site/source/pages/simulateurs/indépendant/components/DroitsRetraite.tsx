import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import {
	Emoji,
	FlexCenter,
	Grid,
	H2,
	H3,
	Li,
	Message,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

export default function DroitsRetraite() {
	const { t } = useTranslation()

	const exonérationRetraiteActive = {
		'une de ces conditions': [
			'indépendant . cotisations et contributions . cotisations . exonérations . Acre',
			'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité',
			'indépendant . profession libérale . CNAVPL . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.indépendant.explications.retraite.titre',
					'Votre retraite'
				)}
			</H2>

			<Condition expression={exonérationRetraiteActive}>
				<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
					Le calcul des droits ouverts à la retraite n’est pas encore implémenté
					pour les cas incluants des d’exonérations de cotisations (Acre,
					pension invalidité, etc).
				</Message>
			</Condition>

			<Condition expression={{ '=': [exonérationRetraiteActive, 'non'] }}>
				<Grid
					container
					columnSpacing={8}
					style={{ justifyContent: 'space-between' }}
				>
					<Grid item>
						<Trans i18nKey="pages.simulateurs.indépendant.explications.retraite.droits">
							<H3>Droits retraite acquis sur l’année</H3>

							<Ul>
								<Li>
									Retraite de base&nbsp;:{' '}
									<Value
										expression="protection sociale . retraite . base . trimestres"
										displayedUnit={t('trimestres acquis')}
									/>
								</Li>

								<WhenApplicable dottedName="protection sociale . retraite . base . CNAVPL">
									<Li>
										Points de retraite de base acquis (CNAVPL)&nbsp;:{' '}
										<Value
											linkToRule
											expression="protection sociale . retraite . base . CNAVPL"
											displayedUnit={t('points')}
										/>
									</Li>
								</WhenApplicable>
								<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
									<Li>
										Revenu cotisé pour la retraite de base&nbsp;:{' '}
										<Value
											linkToRule
											unit="€/an"
											expression="protection sociale . retraite . base . cotisée"
										/>
									</Li>
								</WhenNotApplicable>

								<Li>
									Points de retraite complémentaire acquis&nbsp;:{' '}
									<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
										<Value
											expression="protection sociale . retraite . complémentaire . RCI . points acquis"
											displayedUnit={t('points')}
										/>
									</WhenApplicable>
									<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
										<Strong>non connue</Strong>
										<WhenApplicable dottedName="indépendant . profession libérale">
											<SmallBody>
												Ce simulateur ne gère pas les droits acquis de retraite
												complémentaire pour les professions libérales
											</SmallBody>
										</WhenApplicable>
									</WhenNotApplicable>
								</Li>
							</Ul>
						</Trans>
					</Grid>
					<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
						<Grid item>
							<Trans i18nKey="pages.simulateurs.indépendant.explications.retraite.montant">
								<H3>Projection du montant de votre retraite</H3>
								<CenteredDiv>
									<Value
										linkToRule
										unit="€/mois"
										expression="protection sociale . retraite . base"
									/>
									<ExplicableRule dottedName="protection sociale . retraite . base" />
								</CenteredDiv>
							</Trans>
						</Grid>
					</WhenNotApplicable>
				</Grid>
			</Condition>
		</section>
	)
}

const CenteredDiv = styled.div`
	${FlexCenter}
	justify-content: center;
`
