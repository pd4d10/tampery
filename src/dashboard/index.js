import React from 'react'
import { render } from 'react-dom'
import App from './app'

const root = document.createElement('div')
document.body.appendChild(root)
render(<App />, root)
