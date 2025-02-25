'use client';

import React from 'react';
import { Timeline, TimelineItem } from '@/components/ui/timeline';

export function ProjectTimeline() {
  return (
    <Timeline>
      <TimelineItem title="아이디어 구상" date="2024-01-10">
        블로그와 포트폴리오를 결합한 사이트를 만들 필요성을 느낌.
      </TimelineItem>
      <TimelineItem title="기술 스택 선정" date="2024-01-15">
        Next.js + NestJS + PostgreSQL을 선택하여 개발 진행.
      </TimelineItem>
      <TimelineItem title="초기 버전 개발 완료" date="2024-02-01">
        기본적인 인증 기능과 글 작성 기능 구현.
      </TimelineItem>
    </Timeline>
  );
}