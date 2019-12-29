import React from 'react'
import { Trans, TransProps } from 'react-i18next'

type TProps = { k?: TransProps['i18nKey'] } & TransProps

const T = ({ k, ...props }: TProps) => <Trans i18nKey={k} {...props} />

export { T }
