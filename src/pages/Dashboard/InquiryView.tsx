import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Inquiry {
  id: string;
  projectName: string;
  inquiryStatus: string;
  consumer?: {
    consumerName: string;
  };
  product?: {
    productName: string;
  };
  consultant?: {
    consultantName: string;
  };
  followUpUser?: {
    name: string;
  };
  followUpQuotation?: {
    name: string;
  };
  createdBy?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  remark?: string;
  description?: string;
}

const InquiryView = () => {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`https://nicoindustrial.com/api/inquiry/get/${inquiryId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch inquiry');
        }
        const data = await response.json();
        console.log(data);
        setInquiry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [inquiryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!inquiry) return <div>No inquiry found</div>;

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Inquiry Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Project Name:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.projectName || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Inquiry Status:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.inquiryStatus || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Consumer Name:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.consumer?.consumerName || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Product Name:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.product?.productName || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Consultant Name:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.consultant?.consultantName || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Assigned To:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.followUpUser?.name || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Quotation By:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.followUpQuotation?.name || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Created By:</label>
          <p className="bg-gray-100 rounded px-3 py-1">{inquiry.createdBy?.name || "N/A"}</p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Created At:</label>
          <p className="bg-gray-100 rounded px-3 py-1">
            {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "N/A"}
          </p>
        </div>

        <div className="flex gap-2">
          <label className="mb-1 font-medium text-gray-600">Last Updated:</label>
          <p className="bg-gray-100 rounded px-3 py-1">
            {inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-600">Remark:</label>
        <p className="bg-gray-100 rounded p-3 min-h-20">{inquiry.remark || "N/A"}</p>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium text-gray-600">Description:</label>
        <p className="bg-gray-100 rounded p-3 min-h-20">{inquiry.description || "N/A"}</p>
      </div>

      <button 
        onClick={() => window.history.back()} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
    </div>
  );
};

export default InquiryView;