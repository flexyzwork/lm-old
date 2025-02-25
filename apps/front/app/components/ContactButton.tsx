interface ContactButtonProps {
    freelancer: {
      name: string;
    };
  }
  
  export default function ContactButton({ freelancer }: ContactButtonProps) {
    return (
      <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
        {freelancer.name}님에게 연락하기
      </button>
    );
  }