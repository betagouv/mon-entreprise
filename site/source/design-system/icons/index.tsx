import { HTMLAttributes } from 'react'

import { StyledSVG } from './shared'

export const Chevron = (props: HTMLAttributes<SVGElement>) => (
	<StyledSVG
		{...props}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M7.24744 4.34151C7.61112 3.92587 8.24288 3.88375 8.65852 4.24744L16.6585 11.2474C16.8755 11.4373 17 11.7116 17 12C17 12.2884 16.8755 12.5627 16.6585 12.7526L8.65852 19.7526C8.24288 20.1163 7.61112 20.0742 7.24744 19.6585C6.88375 19.2429 6.92587 18.6111 7.34151 18.2474L14.4814 12L7.34151 5.75259C6.92587 5.38891 6.88375 4.75715 7.24744 4.34151Z"
		/>
	</StyledSVG>
)
