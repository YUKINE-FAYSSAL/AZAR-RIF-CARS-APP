import React, { useState } from 'react';
import api from '../../services/api';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/login', {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  const handleSendCode = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setIsLoading(true);
      await api.post('/api/send-verification-code', {
        email: formData.email
      });
      setShowVerification(true);
      setError('');
    } catch (err) {
      setError("Erreur lors de l'envoi du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      await api.post('/api/verify-code', { 
        email: formData.email, 
        code: verificationCode 
      });
      
      const res = await api.post('/api/signup', {
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        full_name: formData.fullName
      });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsVerified(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError("Code invalide ou expiré");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await api.post('/api/send-verification-code', { email: formData.email });
      setError('Code renvoyé avec succès');
    } catch (err) {
      setError("Erreur lors de l'envoi du code");
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion / Inscription | Taza Rent Car</title>
        <meta name="description" content="Connectez-vous ou créez un compte pour gérer vos réservations, consulter votre profil et profiter de nos services de location." />
      </Helmet>
      <div className="login-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {isVerified ? (
          <div className="verification-success">
            <div className="verification-icon">
              <FaCheckCircle />
            </div>
            <h2>Inscription réussie!</h2>
            <p>Votre compte a été créé avec succès.</p>
            <p>Redirection en cours...</p>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            isLogin ? handleLogin() : (showVerification ? handleVerifyCode() : handleSendCode());
          }}>
            <h2>{isLogin ? 'Connexion' : showVerification ? 'Vérification' : 'Créer un compte'}</h2>
            {error && <p className="error">{error}</p>}

            {!isLogin && showVerification && (
              <>
                <div className="verification-icon">
                  <FaEnvelope />
                </div>
                <p className="verification-message">
                  Nous avons envoyé un code de vérification à :<br />
                  <strong>{formData.email}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Entrez le code à 6 chiffres"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength="6"
                  className="verification-input"
                />
              </>
            )}

            {(!showVerification || isLogin) && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {!isLogin && (
                  <>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirmer mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Téléphone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Nom complet"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </>
                )}
              </>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                'Chargement...'
              ) : isLogin ? (
                'Se connecter'
              ) : showVerification ? (
                'Vérifier le code'
              ) : (
                'Envoyer le code de vérification'
              )}
            </button>

            {!isLogin && showVerification && (
              <p className="resend-link" onClick={handleResendCode}>
                Vous n'avez pas reçu de code ? <span>Renvoyer</span>
              </p>
            )}

            <p className="toggle-link" onClick={() => {
              setIsLogin(!isLogin);
              setShowVerification(false);
              setError('');
            }}>
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà inscrit ? Se connecter"}
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default LoginSignup;