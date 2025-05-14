import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string | null;
  designation: string | null;
  mobileNo: string | null;
  active: boolean;
  deleted: boolean;
}

interface Description {
  descriptionId: number;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: User;
  assignTo?: User;
}

interface Product {
  productId: number;
  productName: string;
  brand?: {
    brandId: number;
    brandName: string;
  };
}

interface Inquiry {
  inquiryId: number;
  projectName: string;
  inquiryStatus: string;
  consumer?: {
    consumerId: number;
    consumerName: string;
  };
  products?: Product[];
  consultant?: {
    consultantId: number;
    consultantName: string;
  };
  followUpUser?: User;
  followUpQuotation?: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt: string;
  updatedAt: string;
  remark?: string;
  description?: Description[];
  estimatePrice?: number | null;
}

const InquiryView = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await fetch(`https://nicoindustrial.com/api/inquiry/get/${inquiryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch inquiry");
        }
        const data = await response.json();
        setInquiry(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [inquiryId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!inquiry) return <div>No inquiry found</div>;

  // Function to get all unique brand names from products
  const getBrandNames = () => {
    if (!inquiry?.products || inquiry.products.length === 0) return "N/A";
    
    const brandNames = new Set<string>();
    inquiry.products.forEach(product => {
      if (product.brand?.brandName) {
        brandNames.add(product.brand.brandName);
      }
    });
    
    return Array.from(brandNames).join(", ") || "N/A";
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Inquiry Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Back to Inquiry List
        </button>
      </div>

      {/* Main Details Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Project Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.projectName || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Inquiry Status:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.inquiryStatus || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Consumer Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.consumer?.consumerName || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Product Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">
              {inquiry.products && inquiry.products.length > 0 
                ? inquiry.products.map(p => p.productName).join(", ") 
                : "N/A"}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Brand Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{getBrandNames()}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Consultant Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.consultant?.consultantName || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Created Name:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.createdBy?.name || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Estimated Price:</label>
            <p className="bg-gray-100 rounded px-3 py-2">
              {inquiry.estimatePrice !== null && inquiry.estimatePrice !== undefined 
                ? `₹${inquiry.estimatePrice.toLocaleString()}` 
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-600">Remark:</label>
          <p className="bg-gray-100 rounded p-3 min-h-20">{inquiry.remark || "N/A"}</p>
        </div>
      </div>

      {/* Follow-Up Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Follow-Up Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Follow-Up Person:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.followUpUser?.name || "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Quotation Person:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.followUpQuotation?.name || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Created At:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "N/A"}</p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Last Updated:</label>
            <p className="bg-gray-100 rounded px-3 py-2">{inquiry.updatedAt ? new Date(inquiry.updatedAt).toLocaleString() : "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Description History Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Description History</h3>
        {inquiry.description && inquiry.description.length > 0 ? (
          <div className="space-y-4">
            {inquiry.description.map((desc, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="mb-2">{desc.description}</p>
                <div className="text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created by:</span> {desc.createdBy?.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Created at:</span> {desc.createdAt ? new Date(desc.createdAt).toLocaleString() : "N/A"}
                  </div>
                  {desc.assignTo && (
                    <div>
                      <span className="font-medium">Assigned to:</span> {desc.assignTo.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="bg-gray-100 rounded p-4">No description history available</p>
        )}
      </div>
    </div>
  );
};

export default InquiryView;