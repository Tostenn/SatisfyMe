import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/api";
import Navbar from "../Layout/Navbar";
import Statistics from "./Statistics";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentResponses, setRecentResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, responsesResponse] = await Promise.all([
        apiService.getStatistics(),
        apiService.getResponses(1, 5),
      ]);

      setStats(statsResponse.data);
      setRecentResponses(responsesResponse.data.responses);
    } catch (error) {
      setError("Erreur lors du chargement des données");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await apiService.exportData(format);

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `satisfyme-export-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export des données");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
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
            onClick={fetchDashboardData}
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
              Dashboard Administrateur
            </h1>
            <p className="text-gray-600 mt-2">
              Aperçu des réponses et statistiques
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Réponses
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats?.total || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Satisfaction
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats?.satisfaction?.pourcentageSatisfaits || 0}%
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Satisfaits
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats?.satisfaction?.satisfaits || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Mécontents
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {stats?.satisfaction?.mecontents || 0}
              </p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/admin/responses"
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">
                Voir toutes les réponses
              </h3>
              <p>Consulter l'ensemble des réponses collectées</p>
            </Link>

            <button
              onClick={() => handleExport("csv")}
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Export CSV</h3>
              <p>Télécharger les données au format CSV</p>
            </button>

            <button
              onClick={() => handleExport("excel")}
              className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Export Excel</h3>
              <p>Télécharger les données au format Excel</p>
            </button>
          </div>

          {/* Statistiques détaillées */}
          {stats && <Statistics stats={stats} />}

          {/* Réponses récentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Réponses récentes</h2>
            {recentResponses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Motif</th>
                      <th className="px-4 py-2 text-left">Satisfaction</th>
                      <th className="px-4 py-2 text-left">Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentResponses.map((response) => (
                      <tr key={response.id} className="border-b">
                        <td className="px-4 py-2">
                          {new Date(response.visitDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-4 py-2">{response.nom}</td>
                        <td className="px-4 py-2">{response.motif}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              response.satisfaction === "Satisfait"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {response.satisfaction}
                          </span>
                        </td>
                        <td className="px-4 py-2">{response.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Aucune réponse récente</p>
            )}

            <div className="mt-4 text-center">
              <Link
                to="/admin/responses"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir toutes les réponses →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
