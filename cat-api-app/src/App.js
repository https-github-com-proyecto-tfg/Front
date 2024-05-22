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
  const [savedImages, setSavedImages] = useState([]); // Estado para almacenar las imágenes guardadas
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('home'); // Estado para controlar la vista activa

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
      setSavedImages([]); // Limpiar las imágenes guardadas al iniciar sesión
      handleViewSavedImages(); // Cargar las imágenes guardadas nuevamente después de iniciar sesión
    });
  };
  

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsLoggedIn(false);
      setImages([]); // Limpiar las imágenes al hacer logout
      setSavedImages([]); // Limpiar las imágenes guardadas al hacer logout
      setView('home'); // Volver a la vista de inicio
    });
  };

  const handleViewOneImage = async () => {
    if (isLoggedIn) {
      setImages([]); // Limpiar las imágenes antes de cargar nuevas
      const data = await getImages();
      setImages(data);
      await sendDataToBackend('Ver una imagen');
    }
  };
  
  const handleViewTenImages = async () => {
    if (isLoggedIn) {
      setImages([]); // Limpiar las imágenes antes de cargar nuevas
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
        setView('savedImages'); // Cambiar a la vista de imágenes guardadas
      } catch (error) {
        console.error('Error al obtener las imágenes guardadas:', error.message);
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
              {savedImages.map((imageUrl, index) => (
                <div key={index}>
                  <img src={imageUrl} alt={`Saved Image ${index}`} />
                </div>
              ))}
              <button onClick={() => setView('home')}>Volver</button> {/* Botón para volver a la vista principal */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
