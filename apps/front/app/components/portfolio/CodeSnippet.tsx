'use client';

import React from 'react';
import { CodeBlock } from '@/components/ui/codeblock';
import { CardSection } from './CardSection';

export function CodeSnippet() {
  return (
    <CardSection title="🔧 핵심 기능 코드">
      <p>다음은 OAuth 로그인 기능을 구현한 코드 예제입니다.</p>
      <CodeBlock language="javascript">
        {`const user = await db.select().from(users).where(eq(users.email, email)).first();
if (!user) {
  const newUser = await db.insert(users).values({ email, provider: 'google' }).returning();
  return generateTokens(newUser);
} else {
  return generateTokens(user);
}`}
      </CodeBlock>
    </CardSection>
  );
}