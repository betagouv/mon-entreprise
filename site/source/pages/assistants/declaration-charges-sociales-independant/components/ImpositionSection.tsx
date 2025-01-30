import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import RuleInput from '@/components/conversation/RuleInput'
import { Condition } from '@/components/EngineValue/Condition'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { FromTop } from '@/components/ui/animate'
import useYear from '@/components/utils/useYear'
import { H2 } from '@/design-system/typography/heading'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { enregistreLaRéponse } from '@/store/actions/actions'

import { SimpleField } from '../../components/Fields'
import { ExplicationsResultatFiscal } from './ExplicationResultatFiscal'

export default function ImpositionSection() {
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const setSituation = useCallback(
		(value: PublicodesExpression | undefined, dottedName: DottedName) => {
			dispatch(enregistreLaRéponse(dottedName, value))
		},
		[dispatch]
	)

	const year = useYear()

	return (
		<>
			<SimpleField
				aria-label={t('Régime d’imposition')}
				dottedName="entreprise . imposition"
			/>

			<WhenAlreadyDefined dottedName="entreprise . imposition">
				<SimpleField dottedName="déclaration charge sociales . comptabilité" />

				<Condition
					expression={'déclaration charge sociales . cotisations payées = non'}
				>
					<FromTop>
						<Condition expression="entreprise . imposition . IR">
							<SimpleField dottedName="entreprise . imposition . régime . micro-entreprise" />
							<Condition expression="entreprise . imposition . régime . micro-entreprise">
								<H2>
									<Trans
										i18nKey={
											'pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.1'
										}
									>
										Quel est votre chiffre d’affaires hors taxes en {{ year }} ?
									</Trans>
								</H2>
								<SmallBody>
									<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.2">
										Indiquez le montant hors taxes de votre chiffre d’affaires
										ou de vos recettes bruts (avant déduction de l’abattement
										forfaitaire pour frais et charges) et avant déduction des
										exonérations fiscales dont vous avez bénéficiées.
									</Trans>
								</SmallBody>
								<SimpleField dottedName="entreprise . chiffre d'affaires . vente restauration hébergement" />
								<SimpleField dottedName="entreprise . chiffre d'affaires . service BIC" />
								<SimpleField dottedName="entreprise . chiffre d'affaires . service BNC" />
							</Condition>
							<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
								<H2>
									<Trans
										i18nKey={
											'pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.3'
										}
									>
										Quel est votre résultat fiscal au titre de l’année{' '}
										{{ year }} ?
										<br />
										<small>
											Charges sociales et exonérations fiscales non incluses{' '}
											<ExplicationsResultatFiscal />
										</small>
									</Trans>
								</H2>
								<SmallBody>
									<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.4">
										Le résultat fiscal correspond aux produits moins les
										charges. Il peut être positif (bénéfice) ou négatif
										(déficit).
									</Trans>
								</SmallBody>
								<BigInput>
									<RuleInput
										dottedName="dirigeant . rémunération . totale"
										onChange={setSituation}
										hideDefaultValue
										displayedUnit="€"
										aria-label={t('Résultat fiscal')}
									/>
								</BigInput>
							</Condition>
						</Condition>
						<Condition expression="entreprise . imposition . IS">
							<H2>
								<Trans
									i18nKey={
										'pages.assistants.declaration-charges-sociales-independant.entreprise.imposition.5'
									}
								>
									Quel est le montant net de votre rémunération en {{ year }} ?
									<br />
									<small>Sans tenir compte des charges sociales</small>
								</Trans>
							</H2>
							<BigInput>
								<RuleInput
									dottedName="dirigeant . rémunération . net"
									onChange={setSituation}
									hideDefaultValue
								/>
							</BigInput>
						</Condition>
					</FromTop>
				</Condition>
			</WhenAlreadyDefined>
		</>
	)
}

const BigInput = styled.div`
	font-size: 130%;
`
