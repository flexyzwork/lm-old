interface Freelancer {
  name: string;
  email: string;
  website?: string;
  profileImage?: string;
  title: string;
  skills: string[];
}

const ContactCard = ({ freelancer }: { freelancer: Freelancer }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900">Contact</h3>
      <p className="text-gray-600 mt-2">{freelancer.email}</p>
      {freelancer.website && (
        <a
          href={freelancer.website}
          className="text-blue-600 hover:underline mt-2 block"
          target="_blank"
          rel="noopener noreferrer"
        >
          {freelancer.website}
        </a>
      )}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 w-full">
        Message
      </button>
    </div>
  );
};

export default ContactCard;
