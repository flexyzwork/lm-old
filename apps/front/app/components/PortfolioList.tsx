interface PortfolioItem {
    title: string;
    description: string;
    image: string;
  }
  
  interface PortfolioListProps {
    portfolio: PortfolioItem[];
  }
  
  export default function PortfolioList({ portfolio }: PortfolioListProps) {
    return (
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">포트폴리오</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h4 className="text-lg font-bold">{item.title}</h4>
              <p className="text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }