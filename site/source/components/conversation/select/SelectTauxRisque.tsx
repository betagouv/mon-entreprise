import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Card, Spacing, TextField } from '@/design-system'

import Worker from './SelectTauxRisque.worker?worker'

const worker = !import.meta.env.SSR ? new Worker() : null

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
	autoFocus,
}: {
	options: Result[]
	autoFocus?: boolean
	id: string
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
		worker?.postMessage({
			options,
		})

		if (worker) {
			worker.onmessage = ({ data: results }: { data: Result[] }) =>
				setSearchResults(results)
		}
	}, [options])

	return (
		<>
			<TextField
				id={id}
				type="search"
				placeholder={t("Saisissez votre domaine d'activité")}
				aria-label={t("Votre domaine d'activité")}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				errorMessage={
					searchResults &&
					searchResults.length === 0 && <Trans>Aucun résultat</Trans>
				}
				onChange={(input) => {
					if (input.length < 2) {
						setSearchResults(undefined)

						return
					}
					worker?.postMessage({ input })
				}}
			/>

			{searchResults &&
				searchResults.map((option) => (
					<Card
						bodyAs={Wrapper}
						onPress={() => submitOnChange(option)}
						compact
						key={JSON.stringify(option)}
						style={{
							padding: '0.4rem',
							marginTop: '0.5rem',
						}}
					>
						<span
							style={{
								flex: '6',
							}}
						>
							{option['Nature du risque']}
						</span>

						<span
							style={{
								flex: '2',
								color: '#333',
								backgroundColor: 'inherit',
								fontSize: '1rem',
							}}
						>
							{formatTauxNet(option['Taux net'])}
						</span>
						<span
							style={{
								flex: '4',
								backgroundColor: '#ddd',
								color: '#333',
								borderRadius: '0.25em',
								padding: '0.5em',
								textAlign: 'center',
							}}
						>
							{option['Catégorie']}
						</span>
					</Card>
				))}
		</>
	)
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	text-align: left;
	font-size: 0.85rem;
`

interface ErrorT extends Error {
	response: unknown
}

export default function SelectAtmp(
	props: Omit<Parameters<typeof SelectComponent>[0], 'options'> & { id: string }
) {
	const [options, setOptions] = useState<Result[] | null>(null)

	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2024.json'
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
