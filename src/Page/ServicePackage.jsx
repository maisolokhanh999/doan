import { useState, useEffect } from "react";

const ServicePackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/services')
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch service packages:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12">Đang tải các gói dịch vụ...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-10 text-primary uppercase tracking-wider text-center">Các Gói Dịch Vụ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="border border-outline-variant p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
            <h3 className="font-serif font-bold text-2xl mb-3 text-primary">{pkg.title}</h3>
            <p className="text-xl font-bold text-secondary mb-4">${pkg.price}/{pkg.duration >= 30 ? 'tháng' : 'lượt'}</p>
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <ul className="mt-auto space-y-2 text-gray-600 font-sans">
              <li>• Thời gian: {pkg.duration} phút</li>
              {pkg.badge && <li>• <span className="text-accent font-bold">{pkg.badge.toUpperCase()}</span></li>}
            </ul>
          </div>
        ))}
        {packages.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">Hiện chưa có gói dịch vụ nào.</p>
        )}
      </div>
    </div>
  );
};

export default ServicePackage;
