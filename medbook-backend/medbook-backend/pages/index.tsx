import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>MedBook - Admin Dashboard</title>
        <meta name="description" content="MedBook Doctor Appointment Booking System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            MedBook Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Doctor Appointment Booking System
          </p>
          <div className="space-x-4">
            <a
              href="/admin/dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </a>
            <a
              href="/api/docs"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              API Documentation
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
