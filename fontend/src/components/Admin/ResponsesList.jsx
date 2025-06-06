import React, { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import Navbar from "../Layout/Navbar";

const ResponsesList = () => {
  const [responses, setResponses] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    fetchResponses(currentPage);
  }, [currentPage]);

  const fetchResponses = async (page) => {
    try {
      setLoading(true);
      const response = await apiService.getResponses(page, 10);
      setResponses(response.data.responses);
      setPagination(response.data.pagination);
    } catch (error) {
      setError("Erreur lors du chargement des réponses");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openModal = (response) => {
    setSelectedResponse(response);
  };

  const closeModal = () => {
    setSelectedResponse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des réponses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchResponses(currentPage)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Toutes les réponses
            </h1>
            <p className="text-gray-600 mt-2">
              {pagination.total} réponse(s) au total
            </p>
          </div>

          {responses.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de visite
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Motif
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response) => (
                        <tr key={response.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(response.visitDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {response.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {response.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.motif}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                response.satisfaction === "Satisfait"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {response.satisfaction}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.service}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openModal(response)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Voir détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border"
                      }`}
                    >
                      Précédent
                    </button>

                    {[...Array(pagination.pages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pagination.pages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border"
                      }`}
                    >
                      Suivant
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune réponse trouvée</p>
            </div>
          )}

          {/* Modal de détails */}
          {selectedResponse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Détails de la réponse
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <strong>Date de visite:</strong>{" "}
                      {new Date(selectedResponse.visitDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </div>
                    <div>
                      <strong>Contact:</strong>
                      <div className="ml-4">
                        <div>Nom: {selectedResponse.nom}</div>
                        <div>Email: {selectedResponse.email}</div>
                        <div>Téléphone: {selectedResponse.telephone}</div>
                      </div>
                    </div>
                    <div>
                      <strong>Motif:</strong> {selectedResponse.motif}
                    </div>
                    <div>
                      <strong>Satisfaction:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedResponse.satisfaction === "Satisfait"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedResponse.satisfaction}
                      </span>
                    </div>
                    <div>
                      <strong>Service:</strong> {selectedResponse.service}
                    </div>
                    {selectedResponse.commentaire && (
                      <div>
                        <strong>Commentaire:</strong>
                        <div className="mt-2 p-3 bg-gray-100 rounded-md">
                          {selectedResponse.commentaire}
                        </div>
                      </div>
                    )}
                    <div>
                      <strong>Date de soumission:</strong>{" "}
                      {new Date(selectedResponse.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-4 border-t">
                  <button
                    onClick={closeModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsesList;
