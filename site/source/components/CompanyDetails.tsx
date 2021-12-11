import Skeleton from 'Components/ui/Skeleton'
import { Strong } from 'DesignSystem/typography'
import { H3 } from 'DesignSystem/typography/heading'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Etablissement, fetchCompanyDetails } from '../api/sirene'

type Company = {
	activite_principale: string
	denomination: string
	prenom_usuel: string
	nom: string
	date_creation: string
	etablissement_siege: {
		libelle_commune: string
		code_postal: string
	}
}

export default function CompanyDetails({ siren, denomination }: Etablissement) {
	const { i18n } = useTranslation()
	const DateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat(i18n.language, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
		[i18n.language]
	)
	const [company, setCompany] = useState<Company>()
	useEffect(() => {
		fetchCompanyDetails(siren).then(setCompany)
	}, [siren])

	if (company === null) {
		return (
			<SmallBody>
				{siren}
				<Trans>est un SIREN non diffusible</Trans>
			</SmallBody>
		)
	}

	return (
		<CompanyContainer>
			<H3
				css={`
					margin-top: 0;
				`}
			>
				{denomination || company ? (
					<>
						{denomination ||
							(company &&
								(company.denomination ||
									company.prenom_usuel + ' ' + company.nom))}{' '}
						<small>({siren})</small>
					</>
				) : (
					<Skeleton width={400} />
				)}
			</H3>

			<SmallBody>
				<Trans>Crée le</Trans>{' '}
				<Strong>
					{company ? (
						DateFormatter.format(new Date(company.date_creation))
					) : (
						<Skeleton width={80} />
					)}
				</Strong>
				,&nbsp;
				{company ? (
					company.etablissement_siege ? (
						<>
							<Trans>domiciliée à</Trans>{' '}
							<strong>{company.etablissement_siege.libelle_commune}</strong> (
							{company.etablissement_siege.code_postal})
						</>
					) : (
						<Trans>domiciliation inconnue</Trans>
					)
				) : (
					<Skeleton width={100} />
				)}
			</SmallBody>
		</CompanyContainer>
	)
}

const CompanyContainer = styled.div`
	text-align: left;
`
