import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	BasicClickableCard,
	Body,
	Li,
	Spacing,
	TextField,
	Ul,
} from '@/design-system'

let worker: Worker | null = null

const getWorker = () => {
	if (!worker && typeof window !== 'undefined') {
		worker = new Worker(
			new URL('./SelectTauxRisque.worker.ts', import.meta.url),
			{ type: 'module' }
		)
	}

	return worker
}

const formatTauxNet = (taux: string) => {
	const tauxNet = parseFloat(taux.replace(',', '.'))
	if (isNaN(tauxNet)) {
		return 'Taux inconnu'
	}

	return `${tauxNet} %`
}

export interface Result {
	'Nature du risque': string
	'Code risque': string
	'Taux net': string
	Catégorie: string
}

function SelectComponent({
	onChange,
	onSubmit,
	id,
	options,
}: {
	options: Result[]
	id?: string
	onChange?: (value: string | undefined) => void
	onSubmit?: () => void
}) {
	const { t } = useTranslation()
	const [searchResults, setSearchResults] = useState<Result[]>()

	const submitOnChange = (option: Result) => {
		const tauxNet = parseFloat(option['Taux net'].replace(',', '.'))
		if (isNaN(tauxNet)) {
			// eslint-disable-next-line no-console
			console.error('Taux inconnu', option)
		}
		onChange?.(isNaN(tauxNet) ? undefined : `${tauxNet}%`)
		onSubmit?.()
	}

	useEffect(() => {
		getWorker()?.postMessage({
			options,
		})

		const currentWorker = getWorker()
		if (currentWorker) {
			currentWorker.onmessage = ({ data: results }: { data: Result[] }) =>
				setSearchResults(results)
		}
	}, [options])

	return (
		<>
			<TextField
				id={id}
				type="search"
				placeholder={t(
					'components.select-taux-risque.placeholder',
					'Saisissez votre domaine d’activité'
				)}
				aria-label={t(
					'components.select-taux-risque.aria-label.field',
					'Votre domaine d’activité'
				)}
				errorMessage={
					searchResults && searchResults.length === 0 ? t('Aucun résultat') : ''
				}
				onChange={(input) => {
					if (input.length < 2) {
						setSearchResults(undefined)

						return
					}
					getWorker()?.postMessage({ input })
				}}
			/>

			{searchResults && (
				<Ul $noMarker>
					{searchResults.map((option) => (
						<Li key={JSON.stringify(option)}>
							<BasicClickableCard
								onClick={() => submitOnChange(option)}
								ariaLabel={t(
									'components.select-taux-risque.aria-label.card',
									'{{taux}}, sélectionner ce taux',
									{ taux: option['Taux net'] }
								)}
							>
								<Container>
									<RisqueContainer>
										{option['Nature du risque']}
									</RisqueContainer>

									<TauxContainer>
										{formatTauxNet(option['Taux net'])}
									</TauxContainer>
									<CatégorieContainer>{option['Catégorie']}</CatégorieContainer>
								</Container>
							</BasicClickableCard>
						</Li>
					))}
				</Ul>
			)}
		</>
	)
}

const Container = styled(Body)`
	display: flex;
	align-items: center;
	column-gap: ${({ theme }) => theme.spacings.xs};
	margin-bottom: 0;
	margin-top: 0;
`

const RisqueContainer = styled.span`
	flex: 6;
`

const TauxContainer = styled.span`
	flex: 2;
`

const CatégorieContainer = styled.span`
	flex: 4;
	background-color: ${({ theme }) => theme.colors.extended.grey[300]};
	border-radius: 0.25em;
	padding: ${({ theme }) => theme.spacings.xs};
	text-align: center;
	font-size: ${({ theme }) => theme.fontSizes.min};
`

interface ErrorT extends Error {
	response: unknown
}

export default function SelectAtmp(
	props: Omit<Parameters<typeof SelectComponent>[0], 'options'>
) {
	const [options, setOptions] = useState<Result[] | null>(null)

	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2026.json'
		)
			.then((response) => {
				if (!response.ok) {
					const error = new Error(response.statusText) as ErrorT
					error.response = response
					throw error
				}

				return response.json() as Promise<Result[]>
			})
			.then((json) => setOptions(json))
			.catch(
				(error) =>
					console.warn('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}, [])

	return (
		<>
			<SelectComponent {...props} options={options || []} />
			<Spacing md />
		</>
	)
}
