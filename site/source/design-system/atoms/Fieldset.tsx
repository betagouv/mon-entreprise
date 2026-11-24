import { styled } from 'styled-components'

// Groupe de champs sans rendu propre : `display: contents` et les remises à zéro
// font que le `fieldset` et sa `legend` n'ajoutent aucune boîte ni marge.
export const Fieldset = styled.fieldset`
	display: contents;

	padding: 0;
	margin: 0;
	border: none;

	& > legend {
		padding: 0;
	}
`
