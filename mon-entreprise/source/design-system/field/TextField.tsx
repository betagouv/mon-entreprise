import { InputHTMLAttributes, useRef } from 'react'
import styled from 'styled-components'
import { useTextField, AriaTextFieldOptions } from '@react-aria/textfield'
import { ExtraSmallBody } from 'DesignSystem/typography/paragraphs'

export default function TextField(props: AriaTextFieldOptions) {
	const ref = useRef<HTMLInputElement>(null)
	const { labelProps, inputProps, descriptionProps } = useTextField(
		{ ...props, inputElementType: 'input' },
		ref
	)

	return (
		<>
			<StyledInputContainer>
				<StyledInput
					{...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
					ref={ref}
				/>
				<StyledLabel {...labelProps}>{props.label}</StyledLabel>
			</StyledInputContainer>
			{props.description && (
				<StyledDescription {...descriptionProps} style={{ fontSize: 12 }}>
					{props.description}
				</StyledDescription>
			)}
		</>
	)
}

const labelHeight = '1rem'
const StyledInputContainer = styled.div`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) => theme.box.borderWidth} solid
		${({ theme }) => theme.colors.extended.grey[500]};
	outline: transparent solid 1px;
	position: relative;
	flex-direction: column;
	transition: outline-color, border-color 0.3s;
	height: ${({ theme }) => theme.spacings.xxxl};

	:focus-within {
		outline-color: ${({ theme }) => theme.colors.bases.primary[600]};
		border-color: ${({ theme }) => theme.colors.bases.primary[600]};
	}

	:focus-within label {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within + p {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	input:not(:focus):placeholder-shown + label {
		font-size: 1rem;
		line-height: 1.5rem;
		pointer-events: none;
		top: 50%;
		transform: translateY(-50%);
	}
`

const StyledInput = styled.input`
	font-size: 1rem;
	line-height: 1.5rem;
	border: none;
	background: none;
	font-family: ${({ theme }) => theme.fonts.main};
	bottom: 0;
	width: 100%;
	height: 100%;
	outline: none;
	position: absolute;
	padding: calc(${labelHeight} + ${({ theme }) => theme.spacings.xs})
		${({ theme }) => theme.spacings.sm} ${({ theme }) => theme.spacings.xs};
`

const StyledLabel = styled.label`
	top: 0%;
	transform: translateY(0%);
	font-size: 0.75rem;
	line-height: ${labelHeight};
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ theme }) => theme.spacings.xs}
		${({ theme }) => theme.spacings.sm};
	position: absolute;
	will-change: transform top font-size line-height color;
	transition: all 0.1s;
`

const StyledDescription = styled(ExtraSmallBody)`
	padding: ${({ theme }) => theme.spacings.xxs}
		${({ theme }) => theme.spacings.sm};
	will-change: feColorMatrix;
	transition: color 0.2s;
`
// /* Type=Input text, Legend=False, Status=Default */

// /* Auto Layout */
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// padding: 20px 16px;

// position: absolute;
// width: 360px;
// height: 64px;
// right: 1634px;
// bottom: 1055px;

// /* Base/UR White */
// background: #FFFFFF;
// /* Base/UR Grey N°5 */
// border: 1px solid #6C757D;
// box-sizing: border-box;
// border-radius: 6px;

// /* Label */

// position: static;
// left: 16px;
// right: 16px;
// top: 20px;
// bottom: 20px;

// /* Form/Label_inactive */
// font-family: Roboto;
// font-style: normal;
// font-weight: normal;
// font-size: 16px;
// line-height: 24px;
// /* identical to box height, or 150% */
// text-align: justify;

// /* Base/UR Grey N°7 */
// color: #212529;

// /* Inside Auto Layout */
// flex: none;
// order: 0;
// align-self: stretch;
// flex-grow: 0;
// margin: 10px 0px;
