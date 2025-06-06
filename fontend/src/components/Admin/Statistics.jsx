import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = ({ stats }) => {
  // Données pour le graphique de satisfaction
  const satisfactionData = {
    labels: ['Satisfaits', 'Mécontents'],
    datasets: [
      {
        data: [stats.satisfaction.satisfaits, stats.satisfaction.mecontents],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique des motifs
  const motifsData = {
    labels: stats.motifs.map(m => m.motif),
    datasets: [
      {
        label: 'Nombre de visites',
        data: stats.motifs.map(m => m.count),
        backgroundColor: '#3B82F6',
        borderColor: '#1D4ED8',
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique des services
  const servicesData = {
    labels: stats.topServices.map(s => s.service),
    datasets: [
      {
        label: 'Nombre de mentions',
        data: stats.topServices.map(s => s.count),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Graphique de satisfaction */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Répartition de la satisfaction</h3>
        <div className="h-64">
          <Pie data={satisfactionData} options={pieOptions} />
        </div>
      </div>

      {/* Graphique des motifs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Motifs de visite</h3>
        <div className="h-64">
          <Bar data={motifsData} options={chartOptions} />
        </div>
      </div>

      {/* Graphique des services - sur toute la largeur */}
      <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Services les plus mentionnés</h3>
        <div className="h-64">
          <Bar data={servicesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;