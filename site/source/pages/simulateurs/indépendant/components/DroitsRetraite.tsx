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
			'indépendant . cotisations et contributions . cotisations . exonérations . ACRE',
			'indépendant . cotisations et contributions . cotisations . exonérations . pension invalidité',
			'indépendant . PL . CNAVPL . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<section>
			<Grid
				container
				columnSpacing={8}
				style={{ justifyContent: 'space-between' }}
			>
				<Trans i18nKey="pages.simulateurs.indépendant.explications.droits-retraite">
					<Grid item>
						<H3 as="h2">Retraite&nbsp;: droits acquis sur l’année</H3>

						<WhenApplicable dottedName="indépendant . cotisations et contributions . cotisations . exonérations . ACRE">
							<Message type="info" border>
								L’exonération ACRE n’a aucune incidence sur la détermination des
								droits à la retraite de base et complémentaire des
								auto-entrepreneurs
							</Message>
						</WhenApplicable>

						<Condition expression={exonérationRetraiteActive}>
							<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
								Le calcul des droits ouverts à la retraite n’est pas encore
								implémenté pour les cas incluants des d’exonérations de
								cotisations (ACRE, pension invalidité, etc).
							</Message>
						</Condition>

						<Condition expression={{ '=': [exonérationRetraiteActive, 'non'] }}>
							<Ul>
								<Li>
									Retraite de base&nbsp;:{' '}
									<Value
										expression="protection sociale . retraite . trimestres"
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
									<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
										<Value
											expression="protection sociale . retraite . complémentaire . RCI . points acquis"
											displayedUnit={t('points')}
										/>
									</WhenApplicable>
									<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
										<Strong>non connue</Strong>
										<WhenApplicable dottedName="indépendant . PL">
											<SmallBody>
												Ce simulateur ne gère pas les droits acquis de retraite
												complémentaire pour les professions libérales
											</SmallBody>
										</WhenApplicable>
									</WhenNotApplicable>
								</Li>
							</Ul>
						</Condition>
					</Grid>
					<Grid item>
						<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
							<H3 as="h2">Projection du montant de votre retraite</H3>
							<CenteredDiv>
								<Value
									linkToRule
									unit="€/mois"
									expression="protection sociale . retraite . base"
								/>
								<ExplicableRule dottedName="protection sociale . retraite . base" />
							</CenteredDiv>
						</WhenNotApplicable>
					</Grid>
				</Trans>
			</Grid>
		</section>
	)
}

const CenteredDiv = styled.div`
	${FlexCenter}
	justify-content: center;
`
