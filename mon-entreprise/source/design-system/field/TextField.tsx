import { InputHTMLAttributes, useRef } from 'react'
import styled from 'styled-components'
import { useTextField, AriaTextFieldOptions } from '@react-aria/textfield'

export default function TextField(props: AriaTextFieldOptions) {
	const ref = useRef<HTMLInputElement>(null)
	const { labelProps, inputProps, descriptionProps } = useTextField(
		{ ...props, inputElementType: 'input' },
		ref
	)

	return (
		<>
			<StyledInputContainer>
				<StyledLabel {...labelProps}>{props.label}</StyledLabel>
				<StyledInput
					{...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
					ref={ref}
				/>
			</StyledInputContainer>
			{props.description && (
				<p {...descriptionProps} style={{ fontSize: 12 }}>
					{props.description}
				</p>
			)}
		</>
	)
}

const StyledInputContainer = styled.div`
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: ${({ theme }) => theme.box.borderWidth} solid
		${({ theme }) => theme.colors.extended.grey[500]};
	outline: transparent solid 1px;
	display: flex;
	flex-direction: column;
	transition: outline-color, border-color 0.3s;

	:focus-within {
		outline-color: ${({ theme }) => theme.colors.bases.primary[600]};
		border-color: ${({ theme }) => theme.colors.bases.primary[600]};
	}

	:focus-within label {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}

	:focus-within label {
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}
`

const StyledInput = styled.input`
	font-size: 1rem;
	line-height: 1.25rem;
	border: none;
	background: none;
	outline: none;
	padding: 0 ${({ theme }) => theme.spacings.sm}
		${({ theme }) => theme.spacings.xs};
`

const StyledLabel = styled.label`
	font-size: 0.75rem;
	line-height: 1rem;
	padding: ${({ theme }) => theme.spacings.xs}
		${({ theme }) => theme.spacings.sm} 0;
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
