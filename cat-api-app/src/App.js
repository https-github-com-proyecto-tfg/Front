import React, { useState, useEffect } from 'react';
import './App.css';
import { getImages, getImagesLimit } from './api'; // Importar funciones de la API
import LoginButton from './components/login'; // Componente de botón de inicio de sesión
import LogoutButton from './components/logout'; // Componente de botón de cierre de sesión
import { gapi } from 'gapi-script'; // Cliente de la API de Google
import Menu from './components/menu'; // Componente de menú

// ID de cliente para la autenticación OAuth
const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  // Estados para almacenar imágenes, imágenes guardadas, estado de inicio de sesión, vista actual y el historial de imágenes
  const [images, setImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('home');
  const [historyImages, setHistoryImages] = useState([]);
  const [userData, setUserData] = useState(null); // Estado para almacenar datos del usuario
  const [userStats, setUserStats] = useState({ paidImages: 0, pendingImages: 0 }); // Estado para almacenar estadísticas del usuario

  // Efecto para cargar el cliente de autenticación de Google al cargar la aplicación
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
        if (authInstance.isSignedIn.get()) {
          const user = authInstance.currentUser.get();
          const profile = user.getBasicProfile();
          const userData = {
            name: profile.getName(),
            email: profile.getEmail()
          };
          setUserData(userData);
        }
      }).catch((error) => {
        console.error('Error al inicializar gapi:', error);
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  useEffect(() => {
    if (isLoggedIn && userData) {
      fetchUserStatistics(userData.email);
    }
  }, [isLoggedIn, userData]);

  // Función para obtener estadísticas del usuario
  const fetchUserStatistics = async (email) => {
    try {
      const response = await fetch(`http://localhost:8081/getUserStatistics?email=${email}`);
      const data = await response.json();
      setUserStats({ paidImages: data.paidImages, pendingImages: data.pendingImages });
    } catch (error) {
      console.error('Error al obtener estadísticas del usuario:', error.message);
    }
  };

  // Función para manejar el inicio de sesión del usuario
  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsLoggedIn(true);
      setSavedImages([]);
      handleViewSavedImages();
    });
  };

  // Función para manejar el cierre de sesión del usuario
  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsLoggedIn(false);
      setImages([]);
      setSavedImages([]);
      setView('home');
    });
  };

  // Función para ver una imagen individual
  const handleViewOneImage = async () => {
    if (isLoggedIn) {
      setImages([]);
      const data = await getImages();
      setImages(data);
      await sendDataToBackend('Ver una imagen');
    }
  };

  // Función para ver diez imágenes
  const handleViewTenImages = async () => {
    if (isLoggedIn) {
      setImages([]);
      const data = await getImagesLimit(10);
      setImages(data);
      await sendDataToBackend('Ver 10 imágenes');
    }
  };

  // Función para manejar el clic en una imagen
  const handleImageClick = async (imageUrl) => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const name = profile.getName();
      const email = profile.getEmail();
      const date = new Date();
      await sendDataToBackend('Imagen Seleccionada', name, email, date, imageUrl);

      // Actualizar estadísticas del usuario inmediatamente después de añadir una imagen a la cesta
      await fetchUserStatistics(email);
    }
  };

  // Función para ver las imágenes guardadas por el usuario
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

  // Función para ver el historial de imágenes pagadas por el usuario
  const handleViewHistory = async () => {
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      try {
        const response = await fetch(`http://localhost:8081/getUserPaidImages?email=${email}`);
        if (!response.ok) {
          throw new Error('Error al obtener las imágenes pagadas');
        }
        const data = await response.json();
        // Actualizar el estado con las imágenes del historial
        setHistoryImages(data);
        // Cambiar la vista para mostrar el historial
        setView('history');
      } catch (error) {
        console.error('Error al obtener las imágenes pagadas:', error.message);
      }
    }
  };

  // Función para pagar las imágenes guardadas por el usuario
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

        // Actualizar estadísticas del usuario inmediatamente después de pagar las imágenes
        await fetchUserStatistics(email);
      } catch (error) {
        console.error('Error al pagar las imágenes:', error.message);
      }
    }
  };

  // Función para eliminar una imagen del carrito de compras
  const handleRemoveFromCart = async (index) => {
    const newSavedImages = [...savedImages];
    newSavedImages.splice(index, 1);
    setSavedImages(newSavedImages);

    // Actualizar estadísticas del usuario inmediatamente después de eliminar una imagen de la cesta
    if (isLoggedIn) {
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      await fetchUserStatistics(email);
    }
  };

  const handleShowUserProfile = () => {
    setView('profile');
  };

  // Función para enviar datos al backend
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
              <button onClick={handleViewHistory}>Historial</button>
              <button onClick={handleShowUserProfile}>Ver Perfil</button>
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
                    <button onClick={() => handleRemoveFromCart(index)}>Eliminar</button>
                  </div>
                ))
              )}
              {savedImages.length > 0 && (
                <button onClick={handlePayForImages}>Pagar</button>
              )}
              <button onClick={() => setView('home')}>Volver</button>
            </div>
          )}
          {view === 'history' && (
            <div className="HistoryContainer">
              <h2>Historial de imágenes pagadas</h2>
              <div className="ImageContainer">
                {historyImages.map((image, index) => (
                  <div key={index}>
                    <img src={image.url} alt={`History Image ${index}`} />
                  </div>
                ))}
              </div>
              <button onClick={() => setView('home')}>Volver</button>
            </div>
          )}
          {view === 'profile' && userData && (
            <div className="user-profile">
              <h2>Perfil de Usuario</h2>
              <p><strong>Nombre:</strong> {userData.name}</p>
              <p><strong>Correo Electrónico:</strong> {userData.email}</p>
              <p><strong>Imágenes Pagadas:</strong> {userStats.paidImages}</p>
              <p><strong>Imágenes Pendientes:</strong> {userStats.pendingImages}</p>
              <button onClick={() => setView('home')}>Volver</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
