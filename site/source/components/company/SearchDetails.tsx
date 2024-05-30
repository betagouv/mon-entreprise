import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import {
	Entreprise,
	établissementEstDifférentDuSiège,
} from '@/domaine/Entreprise'

export default function EntrepriseSearchDetails({
	entreprise,
}: {
	entreprise: Entreprise
}) {
	const { i18n } = useTranslation()

	const { nom, siren, siège, établissement, dateDeCréation } = entreprise

	const DateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(i18n.language, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
		[i18n.language]
	)

	return (
		<CompanyContainer>
			<H4
				as="div"
				style={{
					margin: '0',
				}}
			>
				<>
					{nom} <small>({siren})</small>
				</>
			</H4>
			<Spacing sm />
			<Trans>Crée le :</Trans>{' '}
			<Strong>{DateFormatter.format(dateDeCréation)}</Strong>
			{établissementEstDifférentDuSiège(entreprise) && (
				<>
					<br />
					<Trans>Siège :</Trans> <Strong>{siège?.adresse.complète}</Strong>
				</>
			)}
			<br />
			<Trans>Établissement recherché :</Trans>{' '}
			<Strong>{établissement?.adresse.complète}</Strong>
		</CompanyContainer>
	)
}

const CompanyContainer = styled.div`
	text-align: left;
`
