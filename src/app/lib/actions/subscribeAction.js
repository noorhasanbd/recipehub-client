"use server";

export async function verifyPaymentSession(sessionId) {
  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }

  try {
    const expressUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    
    const response = await fetch(`${expressUrl}/api/payments/verify-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || "Express server validation failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Server Action failure connecting to Express:", error);
    return { success: false, error: "Network connection error" };
  }
}