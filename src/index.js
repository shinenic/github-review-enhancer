import SettingProvider from 'components/Setting/Context/Provider'
import GenerateTokenGuide from 'components/Tour/GenerateTokenGuide'
import { CONTAINER_ID } from 'constants'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import listenContextMenu from 'utils/contextMenuListener'
import { isRepoPathname } from 'utils/github'
import { getSettingFromLocalStorage } from 'utils/setting'

import App from './App'

const checkDomainMatched = (domains) => {
  const { host } = window.location

  return domains.includes(host) || host === 'github.com'
}

const appendGlobalStyle = (drawerWidth) => {
  const style = document.createElement('style')
  style.innerHTML = `
    html {
      margin-left: ${drawerWidth}px;
    }
  `
  document.documentElement.appendChild(style)
}

const createContainer = () => {
  const container = document.createElement('div')
  container.id = CONTAINER_ID
  document.body.appendChild(container)
}

const renderExtension = () => {
  const { drawerWidth, domains } = getSettingFromLocalStorage()

  if (!checkDomainMatched(domains)) return

  /**
   * In the beginning of the page, if the host is Github and the pathname is repo pages,
   * leave space for drawer by appending `margin-left style` to avoid `screen jumping`.
   * (The ReactDom still need to be rendered to support SPA by listening url change)
   */
  if (isRepoPathname()) {
    appendGlobalStyle(drawerWidth)
  }

  const onLoad = () => {
    const queryClient = new QueryClient()

    createContainer()

    ReactDOM.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <SettingProvider>
            <GenerateTokenGuide />
            <App />
          </SettingProvider>
        </QueryClientProvider>
      </React.StrictMode>,
      document.getElementById(CONTAINER_ID)
    )
  }

  window.onload = onLoad
}

listenContextMenu()
renderExtension()
