import React, { useState, useEffect } from 'react';
import './App.css';
import { getImages, getImagesLimit } from './api';
import LoginButton from './components/login';
import LogoutButton from './components/logout';
import { gapi } from 'gapi-script';

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [images, setImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleViewOneImage = async () => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const name = profile.getName();
      const email = profile.getEmail();
      const date = new Date();
      const data = await getImages();
      setImages(data);
      sendDataToBackend('Ver 1 Imagen', name, email, date);
    }
  };

  const handleViewTenImages = async () => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const name = profile.getName();
      const email = profile.getEmail();
      const date = new Date();
      const data = await getImagesLimit(10);
      setImages(data);
      sendDataToBackend('Ver 10 Imágenes', name, email, date);
    }
  };

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsLoggedIn(true);
    });
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsLoggedIn(false);
      setImages([]); // Limpiar las imágenes al hacer logout
    });
  };

  const sendDataToBackend = async (option, name, email, date) => {
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
          <h1>Ver Imágenes</h1>
          <LogoutButton onClick={handleLogout} />
          <button onClick={handleViewOneImage}>Ver 1 Imagen</button>
          <button onClick={handleViewTenImages}>Ver 10 Imágenes</button>
          <div className="ImageContainer">
            {images.map((image, index) => (
              <img key={index} src={image.url} alt={`Image ${index}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
