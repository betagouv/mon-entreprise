import Fuse from 'fuse.js'
import { Key, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { BasicCard } from '../../../card'
import { Li, Ul } from '../../../typography/list'
import { Body } from '../../../typography/paragraphs'
import TextField from '../TextField'
import {
	ChoiceOption,
	ChoiceOptionWithValue,
	isChoiceOptionWithValue,
} from './ChoiceOption'

const LONGUEUR_MINIMALE_RECHERCHE = 2

interface SearchChoiceGroupProps {
	id?: string
	value?: string
	onChange: (value: Key) => void
	autoFocus?: boolean
	aria?: {
		labelledby?: string
		describedby?: string
	}
	options: ChoiceOption[]
}

const aplatit = (options: ChoiceOption[]): ChoiceOptionWithValue[] =>
	options.flatMap((option) =>
		isChoiceOptionWithValue(option) ? [option] : option.children
	)

export default function SearchChoiceGroup({
	id,
	value,
	onChange,
	autoFocus,
	aria,
	options,
}: SearchChoiceGroupProps) {
	const { t } = useTranslation()
	const toutesLesOptions = useMemo(() => aplatit(options), [options])
	const fuse = useMemo(
		() =>
			new Fuse(toutesLesOptions, {
				keys: ['label', 'description'],
				shouldSort: true,
			}),
		[toutesLesOptions]
	)

	const [recherche, setRecherche] = useState(
		() => toutesLesOptions.find((option) => option.value === value)?.label ?? ''
	)
	const [résultats, setRésultats] = useState<ChoiceOptionWithValue[]>()

	const handleRecherche = (saisie: string) => {
		setRecherche(saisie)
		setRésultats(
			saisie.length < LONGUEUR_MINIMALE_RECHERCHE
				? undefined
				: fuse.search(saisie).map(({ item }) => item)
		)
	}

	const choisit = (option: ChoiceOptionWithValue) => {
		setRecherche(option.label)
		setRésultats(undefined)
		onChange(option.value)
	}

	return (
		<>
			<TextField
				id={id}
				type="search"
				value={recherche}
				onChange={handleRecherche}
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				aria-labelledby={aria?.labelledby}
				aria-describedby={aria?.describedby}
				placeholder={t(
					'design-system.search-choice-group.placeholder',
					'Rechercher'
				)}
				errorMessage={
					résultats?.length === 0
						? t('design-system.search-choice-group.no-result', 'Aucun résultat')
						: ''
				}
			/>

			{!!résultats?.length && (
				<Ul $noMarker>
					{résultats.map((option) => (
						<Li key={option.key}>
							<BasicCard
								onPress={() => choisit(option)}
								aria-label={
									option.detail
										? t(
												'design-system.search-choice-group.aria-label.option-avec-détail',
												'{{label}} ({{detail}}), sélectionner',
												{
													label: option.label,
													detail: option.detail,
													interpolation: { escapeValue: false },
												}
											)
										: t(
												'design-system.search-choice-group.aria-label.option',
												'{{label}}, sélectionner',
												{
													label: option.label,
													interpolation: { escapeValue: false },
												}
											)
								}
							>
								<Contenu>
									<Libellé>{option.label}</Libellé>
									{option.detail && <Détail>{option.detail}</Détail>}
									{option.description && (
										<Description>{option.description}</Description>
									)}
								</Contenu>
							</BasicCard>
						</Li>
					))}
				</Ul>
			)}
		</>
	)
}

const Contenu = styled(Body)`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacings.xs};
	align-items: center;
	justify-content: space-between;
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		flex-direction: row;
	}
	width: 100%;
	margin-bottom: 0;
	margin-top: 0;
`

const Libellé = styled.span`
	flex: 6;
`

const Détail = styled.span`
	flex: 2;
`

const Description = styled.span`
	flex: 4;
	background-color: ${({ theme }) => theme.colors.extended.grey[300]};
	border-radius: 0.25em;
	padding: ${({ theme }) => theme.spacings.xs};
	text-align: center;
	font-size: ${({ theme }) => theme.fontSizes.min};
`
