'use client';

import { useEffect, useState } from 'react';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditFreelancerProfile = ({ freelancer, onUpdate, onClose }: any) => {
  const freelancerId = 1;
  const [formData, setFormData] = useState({
    name: freelancer.name,
    title: freelancer.title,
    profileImage: freelancer.profileImage || '',
  });
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/freelancers/${freelancerId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }
    );

      if (res.ok) {
        const updatedData = await res.json();
        onUpdate(updatedData); // ✅ 프로필 업데이트 후 부모 컴포넌트에도 변경 적용
        alert('Profile updated successfully!');
        onClose(); // ✅ 저장 후 자동으로 에디트 창 닫기
    } else {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Name"
            required
          />
          <textarea
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="title"
            required
          />
          <input
            type="text"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Profile Image URL"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditFreelancerProfile;
