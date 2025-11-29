import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { FlexCenter, Grid, H2, H3, Li, Message, Ul } from '@/design-system'

export default function DroitsRetraite() {
	const { t } = useTranslation()

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.auto-entrepreneur.explications.retraite.titre',
					'Votre retraite'
				)}
			</H2>

			<WhenApplicable dottedName="dirigeant . auto-entrepreneur . DROM">
				<Message type="info" border>
					Les exonérations DROM n’ont aucune incidence sur la détermination des
					droits à la retraite de base et complémentaire des auto-entrepreneurs.
				</Message>
			</WhenApplicable>

			<Condition expression="dirigeant . exonérations . ACRE">
				<Message type="info" border>
					L’exonération Acre n’a aucune incidence sur la détermination des
					droits à la retraite de base et complémentaire des auto-entrepreneurs.
				</Message>
			</Condition>

			<Grid
				container
				columnSpacing={8}
				style={{ justifyContent: 'space-between' }}
			>
				<Grid item>
					<Trans i18nKey="pages.simulateurs.auto-entrepreneur.explications.retraite.droits">
						<H3>Droits retraite acquis sur l’année</H3>

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

							<WhenApplicable dottedName="protection sociale . retraite . complémentaire . CIPAV . points acquis">
								<Li>
									Points de retraite complémentaire acquis (Cipav)&nbsp;:{' '}
									<Value
										linkToRule
										expression="protection sociale . retraite . complémentaire . CIPAV . points acquis"
										displayedUnit={t('points')}
									/>
								</Li>
							</WhenApplicable>
							<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . CIPAV . points acquis">
								<Li>
									Points de retraite complémentaire acquis&nbsp;:{' '}
									<Value
										expression="protection sociale . retraite . complémentaire . RCI . points acquis"
										displayedUnit={t('points')}
									/>
								</Li>
							</WhenNotApplicable>
						</Ul>
					</Trans>
				</Grid>
				<Grid item>
					<H3>Projection du montant de votre retraite</H3>
					<CenteredDiv>
						<Value
							linkToRule
							unit="€/mois"
							expression="protection sociale . retraite . base"
						/>
						<ExplicableRule dottedName="protection sociale . retraite . base" />
					</CenteredDiv>
				</Grid>
			</Grid>
		</section>
	)
}

const CenteredDiv = styled.div`
	${FlexCenter}
	justify-content: center;
`
