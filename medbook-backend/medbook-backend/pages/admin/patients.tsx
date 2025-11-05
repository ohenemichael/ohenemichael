import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

export default function PatientsManagement() {
  return (
    <AdminLayout>
      <Head>
        <title>Patients Management - MedBook Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients Management</h1>
          <p className="text-gray-500 mt-1">View and manage patient records</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Patients Management</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Patient management interface - view patient profiles, medical history, and appointments.
            Connect this to your patient API endpoints.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
