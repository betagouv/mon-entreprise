import { useButton } from '@react-aria/button'
import { useSearchField } from '@react-aria/searchfield'
import { useSearchFieldState } from '@react-stately/searchfield'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { animated, useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'
import styled from 'styled-components'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import CompanyDetails from './CompanyDetails'
import { FromTop } from './ui/animate'
import CardSelection from './ui/CardSelection'
import InfoBulle from './ui/InfoBulle'
import { useDebounce } from './utils'
import { useInitialRender } from './utils/useInitialRender'

const config = { mass: 0.5, tension: 250, friction: 25 }
export function CompanySearchField(props: {
	label?: ReactNode
	onValue?: () => void
	onClear?: () => void
	onSubmit?: (établissement: Etablissement) => void
}) {
	const { t } = useTranslation()

	const searchFieldProps = {
		...props,
		label: t('CompanySearchField.label', {
			defaultValue: "Nom de l'entreprise, SIREN ou SIRET",
		}),
		description: (
			<Trans i18nKey="CompanySearchField.description">
				Le numéro Siret est un numéro de 14 chiffres unique pour chaque
				entreprise. Ex : 40123778000127
			</Trans>
		),
		onSubmit(value: string) {
			searchDenominationOrSiren(value).then((result) => {
				if (!result || result.length !== 1) {
					return
				}
				props.onSubmit?.(result[0])
			})
		},
		placeholder: t('CompanySearchField.placeholder', {
			defaultValue: 'Café de la gare ou 40123778000127',
		}),
	}
	const state = useSearchFieldState(searchFieldProps)
	const inputRef = useRef<HTMLInputElement>(null)
	const clearButtonRef = useRef<HTMLButtonElement>(null)
	const { labelProps, inputProps, descriptionProps, clearButtonProps } =
		useSearchField(searchFieldProps, state, inputRef)

	const { buttonProps } = useButton(
		{
			...clearButtonProps,
			'aria-label': t('CompanySearchField.ariaClearLabel', {
				defaultValue: 'Effacer la recherche',
			}),
		},
		clearButtonRef
	)

	const { onValue = () => {}, onClear = () => {} } = props
	useEffect(
		() => (!state.value ? onClear() : onValue()),
		[state.value, onValue, onClear]
	)
	const [ref, { width }] = useMeasure()
	const initialRender = useInitialRender()
	const [inputStyle, api] = useSpring(() => ({
		config,
		width: initialRender ? 'auto' : width,
	}))
	useEffect(() => {
		if (initialRender) {
			return
		}
		api({ width })
	}, [width])

	return (
		<>
			<div css={'display: flex, flex-direction: column, width: 100%'} ref={ref}>
				<label className="ui__ notice" {...labelProps}>
					{searchFieldProps.label}
				</label>{' '}
				<InfoBulle>
					<span {...descriptionProps}>{searchFieldProps.description}</span>
				</InfoBulle>
				<AnimatedInputContainer style={inputStyle}>
					<input
						className="ui__ cta"
						css={`
							width: 100%;
							margin: 0 !important;
						`}
						{...inputProps}
						ref={inputRef}
					/>
					{state.value !== '' && (
						<button
							ref={clearButtonRef}
							css={`
								position: absolute;
								padding: 0 1rem;
								right: 0;
								height: 100%;
								font-size: 2rem;
								color: var(--lighterTextColor);
								text-decoration: none;
							`}
							{...buttonProps}
						>
							×
						</button>
					)}
				</AnimatedInputContainer>
				<Results value={state.value} onSubmit={props.onSubmit ?? (() => {})} />
			</div>
		</>
	)
}

const AnimatedInputContainer = styled(animated.div)`
	position: relative;
	margin-top: 0.4rem;
`

function useSearchCompany(value: string): [boolean, Array<Etablissement>] {
	const [result, setResult] = useState<Array<Etablissement>>([])
	const [searchPending, setSearchPending] = useState(!!value)
	useEffect(() => {
		setSearchPending(!!value)
		if (!value) {
			setResult([])
		}
	}, [value, setResult, setSearchPending])

	const debouncedValue = useDebounce(value, 300)
	useEffect(() => {
		if (!debouncedValue) {
			return
		}
		searchDenominationOrSiren(debouncedValue).then((établissements) => {
			setResult(établissements || [])
			setSearchPending(false)
		})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending, result.slice(0, 5)]
}

function Results({
	value,
	onSubmit,
}: {
	value: string
	onSubmit: (établissement: Etablissement) => void
}) {
	const [searchPending, results] = useSearchCompany(value)

	if (!value) {
		return null
	}

	return !results.length ? (
		<FromTop>
			<div
				className="ui__ lighter-bg"
				css={`
					display: flex;
					margin-top: 0.4rem;
					flex-direction: column;
					padding: 0.6rem 1rem 0;
					border-radius: 0.3rem;
				`}
			>
				{searchPending ? (
					<p className="ui__ notice">Recherche en cours...</p>
				) : (
					<>
						<p>Aucune entreprise correspondante trouvée</p>
						<p className="ui__  notice">
							Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un
							meilleur résultat
						</p>
					</>
				)}
			</div>
		</FromTop>
	) : (
		<>
			<FromTop>
				{results.map((établissement) => (
					<CardSelection
						key={établissement.siren}
						onClick={() => onSubmit(établissement)}
					>
						<CompanyDetails {...établissement} />
					</CardSelection>
				))}
			</FromTop>
		</>
	)
}
