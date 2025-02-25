export async function emailLogin(email: string, password: string) {
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('로그인 실패');

  return await res.json(); // { user, token }
}

export async function socialLogin(provider: 'google' | 'github') {
  const res = await fetch(`/api/auth/${provider}`);
  if (!res.ok) throw new Error('소셜 로그인 실패');

  return await res.json(); // { user, token }
}
