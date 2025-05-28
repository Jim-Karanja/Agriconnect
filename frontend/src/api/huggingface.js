const LOCAL_API = "http://localhost:8000/generate"; // Backend URL

export async function getAgriculturalInsight(userInput) {
  try {
    const response = await fetch(LOCAL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: userInput }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    return `Request failed: ${error.message}`;
  }
}
