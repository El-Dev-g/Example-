
'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getKpiRecommendations, type KpiRecommendationsInput } from '@/ai/flows/kpi-recommendations';

/**
 * Fetches data from the external API using a server-side action to avoid CORS issues.
 * It retrieves the API key from Firestore to authenticate the request.
 * @returns The JSON data from the external API.
 */
export async function fetchExternalApiData() {
  try {
    const apiUrl = process.env.EXTERNAL_APP_API_URL;
    if (!apiUrl) {
      throw new Error("External API URL is not configured in environment variables.");
    }

    const apiSettingsDocRef = adminDb.collection('settings').doc('api');
    const docSnap = await apiSettingsDocRef.get();


    if (!docSnap.exists || !docSnap.data()?.apiKey) {
      throw new Error("API Key not found in Firestore. Please generate one in the Settings page.");
    }
    const apiKey = docSnap.data()?.apiKey;

    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store', // Ensure fresh data is fetched every time
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Catch if error body is not JSON
      throw new Error(errorData.error || `Failed to fetch external data (status: ${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    // We'll re-throw the error with a clean message so the client can display it.
    // Ensure we don't leak sensitive details from the server.
     if (err.message.includes("Failed to fetch external data")) {
        throw new Error(err.message);
    }
    if (err.message.includes("API Key not found")) {
        throw new Error(err.message);
    }
     if (err.message.includes("External API URL is not configured")) {
        throw new Error(err.message);
    }

    console.error("Internal Server Error:", err);
    throw new Error('An unexpected error occurred on the server.');
  }
}

/**
 * Fetches KPI recommendations from the AI flow.
 * @param input The input data for the AI flow.
 * @returns A list of recommended KPIs.
 */
export async function fetchKpiRecommendations(input: KpiRecommendationsInput) {
  try {
    const result = await getKpiRecommendations(input);
    return result.recommendations;
  } catch (error: any) {
    console.error("Error fetching KPI recommendations:", error);
    // Return an error message in a way the client can handle it
    return [`Error: ${error.message || 'An unknown error occurred.'}`];
  }
}
