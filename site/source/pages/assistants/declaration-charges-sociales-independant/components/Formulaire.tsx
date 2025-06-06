import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { Grid, H2, SmallBody } from '@/design-system'
import useYear from '@/hooks/useYear'

import { SimpleField, SubSection } from '../../components/Fields'

export default function Formulaire() {
	const year = useYear()

	return (
		<Grid container>
			<Grid item xs={12} sm={10} md={9} lg={8}>
				<Condition expression="déclaration charge sociales . comptabilité . engagement">
					<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.titre">
						<H2>
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.1">
								Entreprise et activité
							</Trans>
						</H2>
					</Trans>
					<SimpleField
						dottedName="entreprise . date de création"
						showSuggestions={false}
					/>
					<Condition expression="entreprise . date de création > période . fin d'année . N-1">
						<StyledSmallBody>
							<Trans
								i18nKey={
									'pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.2'
								}
							>
								Cette aide à la déclaration concerne uniquement les entreprises
								déjà en activité en {{ year }}
							</Trans>
						</StyledSmallBody>
					</Condition>

					<SubSection dottedName="déclaration charge sociales . nature de l'activité" />
					{/* PLNR */}
					<SimpleField dottedName="entreprise . activités . commerciale . débit de tabac" />
					<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
					<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />

					<H2>
						<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.3">
							Situation personnelle
						</Trans>
					</H2>
					<SimpleField dottedName="situation personnelle . RSA" />
					<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
						<SubSection dottedName="dirigeant . indépendant . IJSS" />
					</Condition>
					<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

					<H2>
						<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.4">
							Exonérations
						</Trans>
					</H2>

					<SimpleField dottedName="déclaration charge sociales . ACRE" />
					<SimpleField dottedName="établissement . ZFU" />
					<Condition expression="établissement . ZFU">
						<SimpleField dottedName="entreprise . salariés . effectif . seuil" />
					</Condition>
					<SubSection
						dottedName="dirigeant . indépendant . cotisations et contributions . exonérations"
						hideTitle
					/>

					<H2>
						<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.5">
							International
						</Trans>
					</H2>
					<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
					<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
						<SubSection
							dottedName="dirigeant . indépendant . revenus étrangers"
							hideTitle
						/>
					</Condition>
				</Condition>

				<Condition expression="déclaration charge sociales . cotisations payées">
					<H2>
						<Trans
							i18nKey={
								'pages.assistants.declaration-charges-sociales-independant.entreprise.formulaire.6'
							}
						>
							Cotisations et contributions sociales en {{ year }}
						</Trans>
					</H2>
					<SimpleField dottedName="déclaration charge sociales . cotisations payées . cotisations sociales" />
					<SimpleField dottedName="déclaration charge sociales . cotisations payées . CSG déductible et CFP" />
				</Condition>
			</Grid>
		</Grid>
	)
}

const StyledSmallBody = styled(SmallBody)`
	color: #ff2d96;
	background-color: 'inherit';
`
