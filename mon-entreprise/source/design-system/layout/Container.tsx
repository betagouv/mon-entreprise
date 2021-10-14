import styled from 'styled-components'

export default styled.div`
	width: 100%;
	margin-right: auto;
	margin-left: auto;

	@media (max-width: 576px) {
		padding-left: 16px;
		padding-right: 16px;
	}

	@media (min-width: 576px) {
		padding-left: 16px;
		padding-right: 16px;
		max-width: 576px;
	}

	@media (min-width: 768px) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 768px;
	}

	@media (min-width: 992px) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 992px;
	}

	@media (min-width: 1200px) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 1200px;
	}
`
