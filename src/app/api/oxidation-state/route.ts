import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Extract 'input' from query parameters (GET request)
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const input = searchParams.get("query");

  // Check if the 'input' parameter is provided and valid
  if (!input || typeof input !== 'string') {
    return NextResponse.json({ error: "Missing or invalid 'input' parameter." }, { status: 400 });
  }

  // Get the API Key from environment variables
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key is missing from environment variables." }, { status: 500 });
  }

  // Construct the URL for the Materials Project API request
  const url = `https://api.materialsproject.org/materials/oxidation_states/?formula=${input}&_per_page=100&_skip=0&_limit=100&_all_fields=true&license=BY-C`;

  try {
    // Make the API request to Materials Project API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,  // Include the API Key in the request headers
        'Accept': 'application/json',  // Accept JSON response
      },
    });

    // If the response is not successful, capture and return the error details
    if (!response.ok) {
      const errorBody = await response.json();  // Capture error details
      return NextResponse.json({ error: errorBody }, { status: 404 });
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data as JSON response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Materials Project API:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
