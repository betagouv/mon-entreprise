import React from 'react'
import { Trans } from 'react-i18next'

let T = ({ k, ...props }) => <Trans i18nKey={k} {...props} />

export { T }
