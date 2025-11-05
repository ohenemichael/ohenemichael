import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

interface PendingDoctor {
  id: string;
  specialization: string;
  qualification: string;
  experience: number;
  licenseNumber: string;
  consultationFee: number;
  bio: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
  };
}

export default function DoctorVerification() {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const response = await fetch('/api/admin/doctors/pending', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setPendingDoctors(data.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (doctorId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/doctors/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          doctorId,
          status,
          reason: status === 'REJECTED' ? rejectionReason : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Doctor ${status.toLowerCase()} successfully`);
        setPendingDoctors(pendingDoctors.filter((d) => d.id !== doctorId));
        setSelectedDoctor(null);
        setRejectionReason('');
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error verifying doctor:', error);
      alert('An error occurred while processing');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Doctor Verification - MedBook Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Verification</h1>
          <p className="text-gray-500 mt-1">
            Review and verify doctor applications ({pendingDoctors.length} pending)
          </p>
        </div>

        {pendingDoctors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">There are no pending doctor verifications at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    Dr. {doctor.user.firstName} {doctor.user.lastName}
                  </h3>
                  <p className="text-primary-100 text-sm">Applied {new Date(doctor.user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-semibold text-gray-900">{doctor.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-900">{doctor.experience} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-semibold text-gray-900">{doctor.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-semibold text-gray-900">GH₵{doctor.consultationFee}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Qualification</p>
                    <p className="font-semibold text-gray-900">{doctor.qualification}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact</p>
                    <p className="text-sm text-gray-700">{doctor.user.email}</p>
                    <p className="text-sm text-gray-700">{doctor.user.phone}</p>
                  </div>

                  {doctor.bio && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bio</p>
                      <p className="text-sm text-gray-700">{doctor.bio}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t flex gap-3">
                    <button
                      onClick={() => handleVerify(doctor.id, 'VERIFIED')}
                      disabled={processing}
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      disabled={processing}
                      className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}'s application:
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(selectedDoctor.id, 'REJECTED')}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
