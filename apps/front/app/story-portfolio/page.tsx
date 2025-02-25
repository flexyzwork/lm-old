'use client';
import dynamic from "next/dynamic";
import React from 'react';
import { IntroductionCard } from '@/components/portfolio/IntroductionCard';
import { ProjectTimeline } from '@/components/portfolio/ProjectTimeline';
// import { TechStackChart } from '@/components/portfolio/TechStackChart';
import { CodeSnippet } from '@/components/portfolio/CodeSnippet';
import { ConclusionCard } from '@/components/portfolio/ConclusionCard';
import { CardSection } from '@/components/portfolio/CardSection';

const DynamicTechStackChart = dynamic(
  () => import("@/components/portfolio/TechStackChart").then((mod) => mod.TechStackChart),
  { ssr: false }
);
export default function StoryPortfolio() {
  return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <IntroductionCard />
        <CardSection title="📅 프로젝트 진행 과정">
          <ProjectTimeline />
        </CardSection>
        <CardSection title="🛠 기술 스택">
          <DynamicTechStackChart />
        </CardSection>
        <CodeSnippet />
        <ConclusionCard />
      </div>
    );
  }

