import React, { useState, useEffect } from 'react';
import './App.css';
import { getImages, getImagesLimit } from './api';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import { gapi } from 'gapi-script';
import Menu from './components/menu';

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [images, setImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('home');

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "email"
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsLoggedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen((signedIn) => {
          setIsLoggedIn(signedIn);
        });
      }).catch((error) => {
        console.error('Error al inicializar gapi:', error);
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsLoggedIn(true);
      setSavedImages([]);
      handleViewSavedImages();
    });
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsLoggedIn(false);
      setImages([]);
      setSavedImages([]);
      setView('home');
    });
  };

  const handleViewOneImage = async () => {
    if (isLoggedIn) {
      setImages([]);
      const data = await getImages();
      setImages(data);
      await sendDataToBackend('Ver una imagen');
    }
  };

  const handleViewTenImages = async () => {
    if (isLoggedIn) {
      setImages([]);
      const data = await getImagesLimit(10);
      setImages(data);
      await sendDataToBackend('Ver 10 imágenes');
    }
  };

  const handleImageClick = async (imageUrl) => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const name = profile.getName();
      const email = profile.getEmail();
      const date = new Date();
      await sendDataToBackend('Imagen Seleccionada', name, email, date, imageUrl);
    }
  };

  const handleViewSavedImages = async () => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      try {
        const response = await fetch(`http://localhost:8081/getUserImages?email=${email}`);
        const data = await response.json();
        setSavedImages(data);
        setView('savedImages');
      } catch (error) {
        console.error('Error al obtener las imágenes guardadas:', error.message);
      }
    }
  };

  const handlePayForImages = async () => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      try {
        const response = await fetch('http://localhost:8081/payForImages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Error al pagar las imágenes');
        }

        setSavedImages([]); // Limpiar las imágenes guardadas después de pagar
        setView('savedImages'); // Mantener la vista de imágenes guardadas
      } catch (error) {
        console.error('Error al pagar las imágenes:', error.message);
      }
    }
  };

  const sendDataToBackend = async (option, name, email, date, imageUrl) => {
    try {
      const response = await fetch('http://localhost:8081/saveUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          option: option,
          name: name,
          email: email,
          date: date.toISOString(),
          timestamp: new Date().toISOString(),
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos al backend');
      }

      console.log('Datos enviados correctamente al backend');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div>
          <h1>Por favor, inicie sesión</h1>
          <LoginButton onClick={handleLogin} />
        </div>
      ) : (
        <div>
          {view === 'home' && (
            <>
              <h1>Ver Imágenes</h1>
              <LogoutButton onClick={handleLogout} />
              <button onClick={handleViewOneImage}>Ver 1 Imagen</button>
              <button onClick={handleViewTenImages}>Ver 10 Imágenes</button>
              <button onClick={handleViewSavedImages}>Ver Cesta</button>
              <div className="ImageContainer">
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image.url} alt={`Image ${index}`} />
                    <button onClick={() => handleImageClick(image.url)}>Seleccionar esta Imagen</button>
                  </div>
                ))}
              </div>
            </>
          )}
          {view === 'savedImages' && (
            <div className="SavedImagesContainer">
              <h2>Estas son sus imágenes en la cesta:</h2>
              {savedImages.length === 0 ? (
                <p>No tienes nada pendiente de pagar</p>
              ) : (
                savedImages.map((imageUrl, index) => (
                  <div key={index}>
                    <img src={imageUrl} alt={`Saved Image ${index}`} />
                  </div>
                ))
              )}
              {savedImages.length > 0 && (
                <button onClick={handlePayForImages}>Pagar</button>
              )}
              <button onClick={() => setView('home')}>Volver</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
