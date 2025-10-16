import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Choice } from '@/components/conversation/Choice'
import { ExplicableRule } from '@/components/conversation/Explicable'
import { Emoji, H3, H4, Radio, Spacing } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { relativeDottedName } from '@/domaine/relativeDottedName'

export function RadioChoices<Names extends string = DottedName>({
	choices,
	defaultValue,
	autoFocus,
	rootDottedName,
	type,
}: {
	choices: Choice
	defaultValue?: string
	autoFocus?: boolean
	rootDottedName: Names
	estimationLabel?: string
	type: 'radio' | 'toggle'
}) {
	const { t } = useTranslation()

	return (
		<>
			{choices.children.map((node) => {
				return (
					<Fragment key={node.dottedName}>
						{' '}
						{'children' in node ? (
							<div
								role="group"
								aria-labelledby={
									node.dottedName.replace(/\s|\./g, '_') + '-legend'
								}
								id={`radio-input-${node.dottedName.replace(
									/\s|\./g,
									'_'
								)}-${rootDottedName.replace(/\s|\./g, '_')}`}
								style={{
									marginTop: '-1rem',
								}}
							>
								<H4 as={H3} id={node.dottedName + '-legend'}>
									{node.title}
								</H4>
								<Spacing lg />
								<StyledSubRadioGroup>
									<RadioChoices
										// eslint-disable-next-line jsx-a11y/no-autofocus
										autoFocus={autoFocus}
										defaultValue={defaultValue}
										choices={node}
										rootDottedName={rootDottedName}
										type={type}
									/>
								</StyledSubRadioGroup>
							</div>
						) : (
							<span>
								<Radio
									// eslint-disable-next-line jsx-a11y/no-autofocus
									autoFocus={
										// Doit autoFocus si correspond à la valeur par défaut
										(defaultValue &&
											defaultValue ===
												`${relativeDottedName(
													rootDottedName,
													node.dottedName
												)}` &&
											autoFocus) ||
										// Sinon doit autoFocus automatiquement
										autoFocus
									}
									value={`${relativeDottedName(
										rootDottedName,
										node.dottedName
									)}`}
									id={`radio-input-${relativeDottedName(
										rootDottedName,
										node.dottedName
									).replace(/\s|\./g, '_')}-${rootDottedName.replace(
										/\s|\./g,
										'_'
									)}`}
								>
									{node.title}
									{node.rawNode.icônes && <Emoji emoji={node.rawNode.icônes} />}
									{type !== 'toggle' && (
										<>
											<ExplicableRule
												light
												dottedName={node.dottedName as DottedName}
												aria-label={t("Plus d'informations sur {{ title }}", {
													title: node.title,
												})}
											/>
										</>
									)}
								</Radio>
							</span>
						)}
					</Fragment>
				)
			})}
			{choices.canGiveUp && (
				<>
					<Radio value={'non'}>{t('Aucun')}</Radio>
				</>
			)}
		</>
	)
}

const StyledSubRadioGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding-left: ${({ theme }) => theme.spacings.md};

	> * {
		flex-shrink: 0;
		margin-right: ${({ theme }) => theme.spacings.md};
	}
	border-left: 2px dotted ${({ theme }) => theme.colors.extended.grey[500]};
	padding-left: ${({ theme }) => theme.spacings.md};
	margin-top: calc(${({ theme }) => theme.spacings.md} * -1);
`
