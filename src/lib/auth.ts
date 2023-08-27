// https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/react/index.tsx
enum AuthProviders {
  DISCORD = 'discord',
  GITHUB = 'github',
}

type Provider = 'discord' | 'github'

export async function getCsrfToken(): Promise<string> {
  const res = await fetch('/auth/csrf')
  const { csrfToken } = await res.json()
  return csrfToken
}

export async function signIn(provider: Provider) {
  const url = new URL(
    `/auth/signin/${provider}`,
    import.meta.env.VITE_NEXTAUTH_URL
  )

  const request = new Request(url.pathname, {
    method: 'post',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      // ...options,
      callbackUrl: `${import.meta.env.VITE_NEXTAUTH_URL}`,
      csrfToken: await getCsrfToken(),
      json: true,
    } as Record<string, any>),
  })

  const res = await fetch(request)
  const data = await res.json()

  const error = new URL(data.url).searchParams.get('error')

  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as any
}
