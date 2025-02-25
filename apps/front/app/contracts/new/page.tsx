"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type Project = {
  id: string;
  title: string;
};

export default function CreateContractPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data: Project[] = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, []);

  const handleCreateContract = async () => {
    const parsedAmount = parseFloat(amount);
    if (!selectedProject || !clientId || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("올바른 정보를 입력해주세요.");
      return;
    }

    const res = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: selectedProject,
        freelancerId: user?.id,
        clientId,
        amount: parsedAmount, 
      }),
    });

    if (res.ok) {
      alert("계약이 성공적으로 생성되었습니다!");
      router.push("/dashboard");
    } else {
      alert("계약 생성에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center">새 계약 작성</h2>

      {/* ✅ 프로젝트 선택 */}
      <div className="mt-6">
        <label className="block font-semibold">프로젝트 선택</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full p-3 border rounded mt-2"
        >
          <option value="">프로젝트를 선택하세요</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ 클라이언트 ID 입력 */}
      <div className="mt-4">
        <label className="block font-semibold">클라이언트 ID</label>
        <input
          type="text"
          placeholder="클라이언트 ID 입력"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      {/* ✅ 계약 금액 입력 */}
      <div className="mt-4">
        <label className="block font-semibold">제안 금액 (USD)</label>
        <input
          type="number"
          placeholder="제안 금액 입력"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2"
        />
      </div>

      {/* ✅ 계약 요청 버튼 */}
      <button
        onClick={handleCreateContract}
        className="mt-6 w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
      >
        계약 요청
      </button>
    </div>
  );
}