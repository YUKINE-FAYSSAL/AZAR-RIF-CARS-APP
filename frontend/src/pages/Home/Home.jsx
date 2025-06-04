import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaChevronDown, FaChevronUp, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../services/api';
import ChatInput from './ChatInput';
import poster from '../../assets/posters/image3.png';
import airportTransport from '../../assets/posters/image1.png';
import carss from '../../assets/posters/white_range-rover-evoque_2024_24704_3c911eaea9c3dbcd49597574e702516f.jpg';
import mobileSlide1 from '../../assets/mobile/mobile-slide-1.jpg';
import mobileSlide2 from '../../assets/mobile/mobile-slide-3.jpg';
import mobileSlide3 from '../../assets/mobile/mobile-slide-2.jpg';
import { cities } from 'moroccan-regions-cities';
import './Home.css';
import airportsMaroc from '../../assets/ville/airports';
import villesMaroc from '../../assets/ville/ville_cars';  
import CarCard  from '../../components/CarCard/CarCard';
import Slider from 'react-slick';
import { FaUser, FaCalendarCheck, FaCar } from "react-icons/fa";
import CountUp from 'react-countup';
import { useInView } from "react-intersection-observer";
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';






export default function Home() {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [activeCar, setActiveCar] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [transportData, setTransportData] = useState({
    nom: '', tel: '', ville: '', aeroport: '', date: ''
  });
  const [carRentalData, setCarRentalData] = useState({
    nom: '', tel: '', ville: '', dateDebut: '', dateFin: '', modele: ''
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeBookingTab, setActiveBookingTab] = useState('car');
  const [villeAirport, setVilleAirport] = useState('');
  const [aeroport, setAeroport] = useState('');
  const [taVille, setTaVille] = useState('');
const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
const [showChat, setShowChat] = useState(false);
const [chatMessages, setChatMessages] = useState([
  { from: 'bot', text: "👋 Salut ! كيف يمكنني مساعدتك ؟\n- Réservation voiture\n- Réservation transport\n- Vidéo شرح" }
]);

const sendMessage = (text) => {
  const newMessages = [...chatMessages, { from: 'user', text }];
  setChatMessages(newMessages);

  setTimeout(() => {
    const t = text.toLowerCase();
    let response = "❌ Désolé, je n'ai pas compris. Essayez : voiture / transport / aide";

    if (/voiture|réserver une voiture/.test(t)) {
      response = "🚗 Pour réserver une voiture : choisissez un véhicule, remplissez vos infos, et cliquez sur Réserver.";
    } else if (/transport|réserver un transport/.test(t)) {
      response = "🚌 Pour réserver un transport : choisissez le trajet et la date, puis cliquez sur Réserver.";
    } else if (/car|book a car/.test(t)) {
      response = "🚗 To book a car: choose the car, enter your details, then click Book.";
    } else if (/transport|book transport/.test(t)) {
      response = "🚌 To book transport: enter your route, date, then click Book.";
    } else if (/سيارة|حجز سيارة/.test(t)) {
      response = "🚗 لحجز سيارة: اختر السيارة، ثم أدخل معلوماتك واضغط على زر الحجز.";
    } else if (/نقل|حجز نقل/.test(t)) {
      response = "🚌 لحجز وسيلة نقل: اختر المدينة، أدخل التاريخ، ثم اضغط على زر الحجز.";
    } else if (/طوموبيل|كرا طوموبيل/.test(t)) {
      response = "🚗 باش تكري طوموبيل: اختار وحدة، عمّر معلوماتك، وڭليكي على Réserver.";
    } else if (/ترانسبور|كرا ترانسبور/.test(t)) {
      response = "🚌 باش تكري ترانسبور: دخل منين لفين، نهار بغيت، وسير كمل.";
    }

    setChatMessages(prev => [...prev, { from: 'bot', text: response }]);
  }, 800);
};



const [stats, setStats] = useState({
  totalUsers: 122,
  totalReservations: 234,
  totalCars: 10,
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await api.get("/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  };

  fetchStats();
}, []);


  useEffect(() => {
    api.get('/admin/stats')
      .then(res => {
        setStats({
          totalUsers: (res.data.totalUsers || 0) + 120,
          totalReservations: (res.data.rentedCars || 0) + 989,
          totalCars: res.data.totalCars || 0,
        });
      })
      .catch(() => {
        setStats({
          totalUsers: 120,
          totalReservations: 989,
          totalCars: 0,
        });
      });
  }, []);

  // Cities handling with fallback
  let villes = [];
  try {
    if (cities) {
      villes = Object.values(cities).flat().sort((a, b) => a.localeCompare(b));
    }
  } catch {
    villes = [];
  }
  
  if (!villes || !villes.length) {
    villes = [
      'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Meknès', 'Oujda', 'Kenitra'
    ];
  }

  const slides = [
    {
      image: poster,
      mobileImage: mobileSlide1,
      title: 'Location de voitures de luxe',
      description: 'Découvrez notre sélection exclusive de véhicules haut de gamme'
    },
    {
      image: airportTransport,
      mobileImage: mobileSlide2,
      title: 'Transport vers l\'aéroport',
      description: 'Service professionnel et ponctuel pour tous vos déplacements'
    },
    {
      image: carss,
      mobileImage: mobileSlide3,
      title: 'Confort et sécurité',
      description: 'Voyagez en toute sérénité avec nos véhicules récents et bien entretenus'
    }
  ];

const heroTexts = [
  {
    title: "Transport professionnel vers l'aéroport",
    subtitle: "Arrivez à temps pour votre vol avec notre service fiable et confortable."
  },
  {
    title: "Découvrez notre flotte premium",
    subtitle: "Des véhicules haut de gamme pour toutes vos occasions spéciales."
  },
  {
    title: "Gagnez du temps avec nos services",
    subtitle: "Location de voitures & transport vers l'aéroport aux meilleurs prix."
  }
];


  const faqs = [
    {
      question: "Quels sont les documents nécessaires pour louer une voiture ?",
      answer: "Vous aurez besoin d'une pièce d'identité valide, d'un permis de conduire en cours de validité et d'une carte de crédit au nom du conducteur principal."
    },
    {
      question: "Quelle est la politique d'annulation ?",
      answer: "Vous pouvez annuler gratuitement jusqu'à 24 heures avant le début de la location. Les annulations effectuées moins de 24 heures à l'avance peuvent être soumises à des frais."
    },
    {
      question: "Y a-t-il une limite de kilométrage ?",
      answer: "Nos locations incluent un kilométrage illimité pour la plupart des véhicules. Certains modèles premium peuvent avoir des restrictions, qui seront clairement indiquées au moment de la réservation."
    },
    {
      question: "Puis-je modifier ma réservation après l'avoir effectuée ?",
      answer: "Oui, vous pouvez modifier votre réservation en nous contactant par téléphone ou via notre site web. Des frais supplémentaires peuvent s'appliquer selon les modifications."
    }
  ];

  useEffect(() => {
    api.get('/cars')
      .then(res => {
        setCars(res.data);
        setActiveCar(res.data[0]);
      })
      .catch(() => {
        setCars([]);
        setActiveCar(null);
      });


    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(slideInterval);
    };
  }, []);

  useEffect(() => {
    // مايتزادش مرتين
    if (!document.getElementById('elfsight-script')) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.id = "elfsight-script";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTransportSubmit = (e) => {
    e.preventDefault();
    api.post('/transport', transportData, { withCredentials: true })
      .then(() => {
  Swal.fire({
    title: "🚐 Demande de transport envoyée !",
    html: `
      <div style="font-size:17px; color:#1d1d1d; text-align:left;">
        <b>Ville de départ :</b> ${transportData.taVille}<br/>
        <b>Aéroport :</b> ${transportData.aeroport}<br/>
        <b>Date :</b> ${formatDateFR(transportData.date)}<br/>
        <b>Nom :</b> ${transportData.nom}
      </div>
      <hr style="margin:14px 0;"/>
      <div style="color:#484848; font-size:15px;">
        Nous allons vous contacter très prochainement pour confirmer votre demande.<br/>
        Merci pour votre confiance !
      </div>
    `,
    icon: "success",
    confirmButtonText: "Fermer",
    customClass: {
      popup: 'swal2-popup-modern'
    }
  });
})

      .catch(() => alert('Erreur lors de l\'envoi ❌'));
  };

  const handleCarRentalSubmit = (e) => {
    e.preventDefault();
    if (!activeCar || !activeCar._id) {
      alert("Veuillez sélectionner un modèle de voiture !");
      return;
    }
api.post(`/reserve/${activeCar._id}`, {
    start_date: carRentalData.dateDebut,
    end_date: carRentalData.dateFin,
    ville: carRentalData.ville,
    full_name: carRentalData.nom,      // ← هنا!
    phone: carRentalData.tel           // ← هنا!
})

      .then(() => {
  Swal.fire({
    title: "🎉 Réservation envoyée !",
    html: `
      <div style="font-size:17px; color:#1d1d1d; text-align:left;">
        <b>Modèle :</b> ${carRentalData.modele}<br/>
        <b>Du</b> ${formatDateFR(carRentalData.dateDebut)} <b>au</b> ${formatDateFR(carRentalData.dateFin)}<br/>
        <b>Ville :</b> ${carRentalData.ville}<br/>
        <b>Nom :</b> ${carRentalData.nom}
      </div>
      <hr style="margin:14px 0;"/>
      <div style="color:#484848; font-size:15px;">
        Nous vous contacterons bientôt pour finaliser votre réservation.<br/>
        Merci pour votre confiance !
      </div>
    `,
    icon: "success",
    confirmButtonText: "Fermer",
    customClass: {
      popup: 'swal2-popup-modern'
    }
  });
})

      .catch(() => alert('Erreur lors de l\'envoi ❌'));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

const openWhatsApp = () => {
  window.open('https://wa.me/212661306515', '_blank');
};

function formatDateFR(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
}
const messagesEndRef = React.useRef(null);

useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }
}, [chatMessages]);


  return (

        <>
      <Helmet>
        <title>Home - AZARYOUH RIF CARS</title>
        {/* Meta Description */}
        <meta name="description" content="Louez une voiture à Taza avec Taza Rent Car. Meilleures offres, service rapide et voitures bien entretenues. Réservez facilement !" />
        {/* Meta Keywords */}
        <meta name="keywords" content="location voiture Taza, louer voiture Taza, Taza Rent Car, voiture pas cher Taza, agence location Taza, car rental Taza, car rental Morocco" />
        
        {/* Meta Tags for English */}
        <meta name="title" content="Taza Rent Car - Car Rental in Taza | Best Deals 🚗" />
        <meta name="description" content="Rent a car in Taza with Taza Rent Car. Best deals, fast service, and well-maintained vehicles. Book online easily!" />
        
        {/* Meta Tags for Arabic */}
        <meta name="title" content="تازة رنت كار - تأجير السيارات في تازة | أفضل العروض 🚗" />
        <meta name="description" content="استأجر سيارة في تازة مع تازة رنت كار. أفضل العروض، خدمة سريعة، وسيارات بحالة ممتازة. احجز عبر الإنترنت بسهولة!" />
        
        {/* Open Graph Meta Tags for Social Media */}
        <meta property="og:title" content="Taza Rent Car - Location de Voitures à Taza" />
        <meta property="og:description" content="Louez une voiture à Taza avec Taza Rent Car. Meilleures offres, service rapide et voitures bien entretenues. Réservez facilement !" />
        <meta property="og:image" content="https://www.tazarentcar.com/logo.png" />
        <meta property="og:url" content="https://www.tazarentcar.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Taza Rent Car - Location de Voitures à Taza" />
        <meta name="twitter:description" content="Louez une voiture à Taza avec Taza Rent Car. Meilleures offres, service rapide et voitures bien entretenues." />
        <meta name="twitter:image" content="https://www.tazarentcar.com/logo.png" />
        
        {/* Canonical Link */}
        <link rel="canonical" href="https://www.tazarentcar.com" />
      </Helmet>
    <div className="home-modern">
      {/* WhatsApp Button */}
      <button className="whatsapp-button" onClick={openWhatsApp}>
        <FaWhatsapp size={24} />
      </button>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h5>Planifiez votre trajet</h5>
          <h1>{heroTexts[currentSlide].title}</h1>
          <p>{heroTexts[currentSlide].subtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/cars')}>Voir les voitures</button>
            <button className="btn-dark" onClick={() => navigate('/services')}>En savoir plus</button>
          </div>
        </div>
        
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img 
                src={window.innerWidth < 768 && slide.mobileImage ? slide.mobileImage : slide.image} 
                alt={slide.title}
              />
            </div>
          ))}
          <div className="slider-controls">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`slider-control ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dual Booking Forms */}
      <div className="booking-container">
        {/* Mobile Tab Switcher */}
        <div className="booking-tabs">
          <div 
            className={`booking-tab ${activeBookingTab === 'car' ? 'active' : ''}`}
            onClick={() => setActiveBookingTab('car')}
          >
            Location Voiture
          </div>
          <div 
            className={`booking-tab ${activeBookingTab === 'airport' ? 'active' : ''}`}
            onClick={() => setActiveBookingTab('airport')}
          >
            Transport Aéroport
          </div>
        </div>

        {/* Car Rental Form */}
        <div className={`booking-form ${activeBookingTab === 'car' ? 'active' : ''}`}>
          <h3>Réserver une voiture</h3>
          <form onSubmit={handleCarRentalSubmit}>
            <input 
              type="text" 
              placeholder="Nom complet" 
              required 
              onChange={e => setCarRentalData({ ...carRentalData, nom: e.target.value })} 
            />
            <input 
              type="tel" 
              placeholder="Téléphone" 
              required 
              onChange={e => setCarRentalData({ ...carRentalData, tel: e.target.value })} 
            />
<select 
  required 
  value={carRentalData.ville}
  onChange={e => setCarRentalData({ ...carRentalData, ville: e.target.value })}
>
  <option value="">Sélectionne ta ville</option>
  {villesMaroc.map((v, i) => <option key={i} value={v}>{v}</option>)}
</select>

            <select 
  required 
  onChange={e => setCarRentalData({ ...carRentalData, modele: e.target.value })}
>
  <option value="">Sélectionner un modèle</option>
  {cars
    .filter(car => car.is_available === true || car.is_available === "true")
    .map(car => (
      <option key={car._id} value={`${car.make} ${car.model}`}>
        {car.make} {car.model}
      </option>
    ))}
</select>
            <input 
              type="datetime-local" 
              placeholder="Date de début" 
              required 
              onChange={e => setCarRentalData({ ...carRentalData, dateDebut: e.target.value })} 
            />
            <input 
              type="datetime-local" 
              placeholder="Date de fin" 
              required 
              onChange={e => setCarRentalData({ ...carRentalData, dateFin: e.target.value })} 
            />
            <button type="submit" className="btn-primary">Réserver</button>
          </form>
        </div>

        {/* Airport Transport Form */}
        <div className={`booking-form ${activeBookingTab === 'airport' ? 'active' : ''}`}>
          <h3>Transport vers l'aéroport</h3>
<form onSubmit={handleTransportSubmit}>
    <input 
    type="text" 
    placeholder="nom et prénom " 
    required  
  />
  <input 
    type="tel" 
    placeholder="Téléphone" 
    required 
    onChange={e => setTransportData({ ...transportData, tel: e.target.value })} 
  />

  {/* 1. Ta ville */}
  <select
    required
    value={transportData.taVille || ''}
    onChange={e => setTransportData({ ...transportData, taVille: e.target.value })}
  >
    <option value="">Sélectionne ta ville</option>
    {villesMaroc.map((v, i) => <option key={i} value={v}>{v}</option>)}
  </select>

  {/* 2. Ville aéroport */}
  <select
    required
    value={villeAirport}
    onChange={e => {
      setVilleAirport(e.target.value);
      setAeroport('');
      setTransportData({ ...transportData, ville: e.target.value, aeroport: '' });
    }}
  >
    <option value="">Sélectionne la ville aéroport</option>
    {airportsMaroc.map((item, i) => (
      <option key={i} value={item.ville}>{item.ville}</option>
    ))}
  </select>

  {/* 3. Sélection aéroport */}
  <select
    required
    value={aeroport}
    onChange={e => {
      setAeroport(e.target.value);
      setTransportData({ ...transportData, aeroport: e.target.value });
    }}
    disabled={!villeAirport}
  >
    <option value="">Sélectionne l’aéroport</option>
    {villeAirport && airportsMaroc.find(v => v.ville === villeAirport)?.aeroports.map((ap, i) => (
      <option key={i} value={ap.nom}>{ap.nom} ({ap.code})</option>
    ))}
  </select>

  <input 
    type="datetime-local" 
    required 
    onChange={e => setTransportData({ ...transportData, date: e.target.value })} 
  />
  <button type="submit" className="btn-primary">Réserver</button>
</form>

        </div>
      </div>

<section className="home-cars-slider-section">
  <h2 className="section-title-center">Nos meilleures voitures</h2>

  <div className="cars-slider-container">
    <Slider
      dots={true}
      infinite={true}
      speed={500}
      slidesToShow={Math.min(3, cars.length)}
      slidesToScroll={1}
      responsive={[
        {
          breakpoint: 1024,
          settings: { slidesToShow: Math.min(2, cars.length), slidesToScroll: 1 }
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 1, slidesToScroll: 1 }
        }
      ]}
      className="cars-slider"
    >
      {cars.slice(0, 6).map(car => (
        <div key={car._id} className="slider-item">
          <CarCard car={car} />
        </div>
      ))}
    </Slider>
    <div className="home-cars-btn-container" style={{marginTop: 32}}>
      <button className="btn-primary" onClick={() => navigate('/cars')}>
        Voir toutes les voitures
      </button>
    </div>
  </div>
</section>


<div className="testimonials-section">
  <h2 className="section-title-center">Témoignages des clients</h2>
  <div className="elfsight-app-a7cfbe91-b183-447f-90a8-ca18b08407fd" data-elfsight-app-lazy></div>
</div>

<div className="stats-row" ref={ref}>
  <div className="stat-card">
    <FaUser className="stat-icon" style={{ color: "#e30613", fontSize: 32 }} />
    <div>
      <div className="stat-label" style={{ color: "#e30613", fontWeight: "bold" }}>Utilisateurs</div>
      <div className="stat-count" style={{ color: "#e30613", fontWeight: "bold", fontSize: 32 }}>
        {inView ? <CountUp end={stats.totalUsers} duration={2} /> : 0}+
      </div>
    </div>
  </div>

  <div className="stat-card">
    <FaCalendarCheck className="stat-icon" style={{ color: "#e30613", fontSize: 32 }} />
    <div>
      <div className="stat-label" style={{ color: "#e30613", fontWeight: "bold" }}>Réservations</div>
      <div className="stat-count" style={{ color: "#e30613", fontWeight: "bold", fontSize: 32 }}>
        {inView ? <CountUp end={stats.totalReservations} duration={2} /> : 0}+
      </div>
    </div>
  </div>

  <div className="stat-card">
    <FaCar className="stat-icon" style={{ color: "#e30613", fontSize: 32 }} />
    <div>
      <div className="stat-label" style={{ color: "#e30613", fontWeight: "bold" }}>Voitures</div>
      <div className="stat-count" style={{ color: "#e30613", fontWeight: "bold", fontSize: 32 }}>
        {inView ? <CountUp end={stats.totalCars} duration={2} /> : 0}+
      </div>
    </div>
  </div>
</div>



      {/* FAQ Section */}
      <section className="faq-section">
        <h5>Questions fréquentes</h5>
        <h2>FAQ</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>




      {/* Contact Section */}
      <section className="contact-section">
        <h5>Contactez-nous</h5>
        <h2>Informations de contact</h2>
        <div className="contact-container">
          <div className="contact-info">
<p><FaPhone /> +212-661-306515</p>
<p><FaEnvelope /> azaryouhrif@gmail.com</p>
<p><FaMapMarkerAlt /> Ben Abdellah immo AXA، Rue Ali Ibn Abi Talib Ang, Rue Allal Ben Abdallah, Taza 35000</p>

          </div>
          <div className="contact-info">
            <h3>Heures d'ouverture</h3>
            <p>Lundi - Vendredi: 8h - 22h</p>
            <p>Samedi: 9h - 18h</p>
            <p>Dimanche: 10h - 18h</p>
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
{showScroll && (
  <button className="scroll-top" onClick={scrollToTop}>
    <FaArrowUp />
  </button>
)}

{/* Chatbot */}
{showChat && (
  <div className="chatbot-container">
    <div className="chatbot-header">
      <div className="chatbot-title">
        <div className="chatbot-avatar">🤖</div>
        <h3>AZARYOUH AI Assistant</h3>
      </div>
      <button 
        className="chatbot-close" 
        onClick={() => setShowChat(false)}
      >
        &times;
      </button>
    </div>
<div className="chatbot-messages" ref={messagesEndRef}>
  {chatMessages.map((msg, i) => (
    <div 
      key={i} 
      className={`chat-message ${msg.from === 'bot' ? 'bot-message' : 'user-message'}`}
    >
      {msg.text.split('\n').map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </div>
  ))}
</div>

    <ChatInput onSend={sendMessage} />
  </div>
)}

<button 
  className="chatbot-toggle" 
  onClick={() => setShowChat(!showChat)}
  style={{ bottom: showChat ? 'calc(300px + 90px)' : '90px' }} // ها التعديل
>
  <div className="chatbot-toggle-icon">💬</div>
  <span>Besoin d'aide ?</span>
</button>


    </div>
    </>
  );
}
