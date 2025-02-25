"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function CreateProjectPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");

  const handleCreateProject = async () => {
    if (!title || !description || !budget) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        budget: Number(budget),
        deadline,
        tags: tags.split(",").map((tag) => tag.trim()),
        clientId: user?.id,
      }),
    });

    if (res.ok) {
      alert("프로젝트가 성공적으로 등록되었습니다!");
      router.push("/dashboard");
    } else {
      alert("프로젝트 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center">새 프로젝트 작성</h2>

      <div className="mt-6">
        <label className="block font-semibold">프로젝트 제목</label>
        <input
          type="text"
          placeholder="프로젝트 제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">프로젝트 설명</label>
        <textarea
          placeholder="프로젝트 설명 입력"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2 h-32"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">예산 (USD)</label>
        <input
          type="number"
          placeholder="예산 입력"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">마감일</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">태그 (쉼표로 구분)</label>
        <input
          type="text"
          placeholder="예: React, Next.js, TailwindCSS"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      <button
        onClick={handleCreateProject}
        className="mt-6 w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
      >
        프로젝트 등록
      </button>
    </div>
  );
}