'use client'
import React, { useState } from "react";

// Define the types of the data we will receive.
interface ElementData {
  builder_meta: {
    emmet_version: string;
    pymatgen_version: string;
    run_id: string;
    database_version: string;
    build_date: string;
    license: string;
  };
  nsites: number;
  elements: string[];
  average_oxidation_states: { [key: string]: number };
  formula_pretty: string;
  volume: number;
  density: number;
  symmetry: {
    crystal_system: string;
    symbol: string;
  };
  property_name: string;
  material_id: string;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ElementData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/oxidation-state?query=${query}`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        const error = data.error;
        console.log(error);
        throw new Error("Failed to fetch data.");
      }
      setResults(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Search Material Data</h1>
      
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter a compound or element (e.g. Cr, CrO3, CrO*). * are wildcards."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 w-80 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-center text-red-600 mt-2">{error}</p>}

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-4">Results:</h2>
          <ul className="space-y-4">
            {results.map((item) => (
              <li key={item.material_id} className="p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                <h3 className="text-xl font-medium text-blue-600">{item.formula_pretty}</h3>
                <p><strong className="text-gray-700">Material ID:</strong> {item.material_id}</p>
                <p><strong className="text-gray-700">Density:</strong> {item.density} g/cm³</p>
                <p><strong className="text-gray-700">Volume:</strong> {item.volume} Å³</p>
                <p><strong className="text-gray-700">Symmetry:</strong> {item.symmetry.crystal_system} ({item.symmetry.symbol})</p>
                {/* Display the average oxidation states */}
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-800">Average Oxidation States:</h4>
                  <ul className="list-disc ml-6 text-gray-700">
                    {Object.entries(item.average_oxidation_states).map(([element, oxidationState]) => (
                      <li key={element}>
                        <strong>{element}:</strong> {oxidationState}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
