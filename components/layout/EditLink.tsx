import { useEffect } from 'react'
import Cookies from 'js-cookie'

export const EditLink = () => {
  let authTab: Window

  const onClick = async () => {
    localStorage.setItem('fork_full_name', '')

    authTab = window.open(
      `/github/start-auth`,
      '_blank',
      'fullscreen=no, width=1000, height=800'
    )

    window.addEventListener(
      'storage',
      e => {
        updateStorageEvent(e)
        authTab.location.pathname = '/github/fork'
      },
      true
    )
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('storage', updateStorageEvent, true)
    }
  }, [])

  return (
    <div onClick={onClick}>
      <a>Edit this page</a>
    </div>
  )
}

async function updateStorageEvent(e) {
  if (e.key == 'github_code') {
    await handleAuthCode(e.newValue)
  }
  if (e.key == 'fork_full_name') {
    handleForkCreated(e.newValue)
  }
}

async function handleAuthCode(code: string) {
  const token = await requestGithubAccessToken(code)
}

async function handleForkCreated(forkName: string) {
  Cookies.set('fork_full_name', forkName, { sameSite: 'strict' })
  fetch(`/api/preview`).then(() => {
    window.location.reload()
  })
}

const requestGithubAccessToken = async (code: string) => {
  const resp = await fetch(`/api/get-github-access-token?code=${code}`)
  const tokenData = await resp.json()
  return tokenData.access_token
}