import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Stats.css';
import {
  FaCar, FaCheckCircle, FaClock, FaMoneyBillWave,
  FaUsers, FaUserPlus, FaFileContract, FaCalendarAlt,
  FaChartBar, FaHome, FaCarSide, FaPlus, FaUser, 
  FaFileAlt, FaCalendarCheck, FaArrowLeft
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  ArcElement,
  Title
} from 'chart.js';

// Enregistrement des composants ChartJS
ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  ArcElement,
  Title
);

const Stats = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    rentedCars: 0,
    totalUsers: 0,
    newUsers: 0,
    avgPrice: 0,
    totalContracts: 0,
    recentContracts: 0,
    carTypes: {},
    monthlyRentals: []
  });

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        alert("Erreur lors du chargement des statistiques. Veuillez vérifier le serveur.");
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Préparation des données pour les graphiques
  const carTypesData = {
    labels: Object.keys(stats.carTypes),
    datasets: [{
      label: 'Nombre de voitures',
      data: Object.values(stats.carTypes),
      backgroundColor: [
        'rgba(52, 152, 219, 0.7)',
        'rgba(46, 204, 113, 0.7)',
        'rgba(155, 89, 182, 0.7)',
        'rgba(241, 196, 15, 0.7)',
        'rgba(230, 126, 34, 0.7)',
        'rgba(231, 76, 60, 0.7)'
      ],
      borderColor: [
        'rgba(52, 152, 219, 1)',
        'rgba(46, 204, 113, 1)',
        'rgba(155, 89, 182, 1)',
        'rgba(241, 196, 15, 1)',
        'rgba(230, 126, 34, 1)',
        'rgba(231, 76, 60, 1)'
      ],
      borderWidth: 1
    }]
  };

  const monthlyRentalsData = {
    labels: (stats.monthlyRentals || []).map(item => item.month),
    datasets: [{
      label: 'Locations par mois',
      data: (stats.monthlyRentals || []).map(item => item.count),
      backgroundColor: 'rgba(52, 152, 219, 0.7)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 2
    }]
  };

  if (loading) {
    return (
      <div className="admin-stats">
        <h2><FaChartBar /> Tableau de bord</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="admin-stats mobile-stats">
        <h2><FaChartBar /> Aperçu du tableau de bord</h2>

        <div className="stats-table-section">
          <h3><FaCar /> Véhicules</h3>
          <table className="stats-table">
            <tbody>
              <tr><td>Total voitures</td><td className="highlight">{stats.totalCars}</td></tr>
              <tr><td>Disponibles</td><td className="highlight">{stats.availableCars}</td></tr>
              <tr><td>Louées</td><td className="highlight">{stats.rentedCars}</td></tr>
              <tr><td>Prix moyen</td><td className="highlight">{stats.avgPrice.toLocaleString()} DH</td></tr>
            </tbody>
          </table>
        </div>

        <div className="stats-table-section">
          <h3><FaUsers /> Utilisateurs</h3>
          <table className="stats-table">
            <tbody>
              <tr><td>Total utilisateurs</td><td className="highlight">{stats.totalUsers}</td></tr>
              <tr><td>Nouveaux (7j)</td><td className="highlight">{stats.newUsers}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="stats-table-section">
          <h3><FaFileContract /> Contrats</h3>
          <table className="stats-table">
            <tbody>
              <tr><td>Total contrats</td><td className="highlight">{stats.totalContracts}</td></tr>
              <tr><td>Récents (28j)</td><td className="highlight">{stats.recentContracts}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="chart-container">
          <h3><FaChartBar /> Types de véhicules</h3>
          <div className="chart-wrapper">
            <Pie 
              data={carTypesData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        family: "'Segoe UI', Roboto, sans-serif"
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-stats">
      <h2><FaChartBar /> Tableau de bord</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaCar /></div>
          <h4>Total voitures</h4>
          <p>{stats.totalCars}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaCheckCircle /></div>
          <h4>Disponibles</h4>
          <p>{stats.availableCars}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaClock /></div>
          <h4>Louées</h4>
          <p>{stats.rentedCars}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <h4>Prix moyen</h4>
          <p>{stats.avgPrice.toLocaleString()} DH</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <h4>Total utilisateurs</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUserPlus /></div>
          <h4>Nouveaux (7j)</h4>
          <p>{stats.newUsers}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaFileContract /></div>
          <h4>Total contrats</h4>
          <p>{stats.totalContracts}</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <h4>Récents (28j)</h4>
          <p>{stats.recentContracts}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h3><FaCar /> Répartition des types de véhicules</h3>
          <div className="chart-wrapper">
            <Pie 
              data={carTypesData} 
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      font: {
                        family: "'Segoe UI', Roboto, sans-serif"
                      }
                    }
                  },
                  tooltip: {
                    bodyFont: {
                      family: "'Segoe UI', Roboto, sans-serif"
                    },
                    titleFont: {
                      family: "'Segoe UI', Roboto, sans-serif"
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="chart-section">
          <h3><FaCalendarCheck /> Locations mensuelles</h3>
          <div className="chart-wrapper">
            <Bar 
              data={monthlyRentalsData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: {
                        family: "'Segoe UI', Roboto, sans-serif"
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        family: "'Segoe UI', Roboto, sans-serif"
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      font: {
                        family: "'Segoe UI', Roboto, sans-serif"
                      }
                    }
                  },
                  tooltip: {
                    bodyFont: {
                      family: "'Segoe UI', Roboto, sans-serif"
                    },
                    titleFont: {
                      family: "'Segoe UI', Roboto, sans-serif"
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
