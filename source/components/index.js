import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

let T = ({ k, ...props }) => <Trans i18nKey={k} {...props} />

export { React, Component, T, emoji }

