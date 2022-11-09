import { createGlobalStyle, css } from 'styled-components'

export const SROnly = css`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap; /* added line */
	border: 0;
`
/*
 * Les @font-face sont généré avec https://google-webfonts-helper.herokuapp.com/
 * Les fonts sont stockées dans source/static/fonts
 */
export const GlobalStyle = createGlobalStyle`
/* roboto-regular - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local(''),
       url('/fonts/roboto-v29-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 400;
  src: local(''),
       url('/fonts/roboto-v29-latin-italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-500 - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: local(''),
       url('/fonts/roboto-v29-latin-500.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-500.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-500italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 500;
  src: local(''),
       url('/fonts/roboto-v29-latin-500italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-500italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-700 - latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local(''),
       url('/fonts/roboto-v29-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* roboto-700italic - latin */
@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: 700;
  src: local(''),
       url('/fonts/roboto-v29-latin-700italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/roboto-v29-latin-700italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

/* montserrat-700 - latin */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  src: local(''),
       url('/fonts/montserrat-v18-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/fonts/montserrat-v18-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
	font-display: swap;
}

html {
	transition: none !important;
	box-sizing: border-box;
	font-size: 16px;
	overflow-y: auto;
	overflow-x: hidden;
}

html, body, #js, #js > * {
	min-height: 100%;
}

*,
*:before,
*:after {
	box-sizing: inherit;
	transition: color 0.15s, background-color 0.15s;
}

body {
	margin: 0;

}


/* Reset fieldset style */
fieldset {
	border: 0;
	padding: 0;
	padding-top: 0.01em;
	margin: 0;
	min-width: 0;
}


button:enabled {
	cursor: pointer;
}


.sr-only {
	${SROnly}
}

.visually-hidden {
	position: absolute;
	position: absolute !important;
	width: 1px !important;
	height: 1px !important;
	padding: 0 !important;
	margin: -1px !important;
	overflow: hidden !important;
	clip: rect(0,0,0,0) !important;
	white-space: nowrap !important;
	border: 0 !important;
}

figure {
	margin: 0;
	padding: 0;
}

.print-only {
	display: none;
}
@media print {
	.print-only {
		display: initial;
	}
}


@media print {
	.print-hidden {
		display: none !important;
	}
	.print-background-force {
		color-adjust: exact !important;
	}
	.print-no-break-inside {
		break-inside: avoid;
	}

	body {
		margin: 00mm;
	}

	html {
		line-height: 1.5em;
	}
}
@page {
	margin-top: 0.7cm;
	margin-bottom: 0.7cm;
}

@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
	html {
		font-size: 0.9rem;
	}
}

`

export const FocusStyle = css`
	outline: ${({ theme }) => theme.spacings.xxs} solid
		${({ theme }) => theme.colors.bases.primary[400]};
	outline-offset: ${({ theme }) => theme.spacings.xxs};
`
