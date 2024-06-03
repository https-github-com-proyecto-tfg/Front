import React from 'react';
import './menu.css';

const Menu = ({ isLoggedIn, handleViewOneImage, handleViewTenImages, handleViewSavedImages, handleViewHistory, handleLogout }) => {
  return (
    <div className="Menu">
      {isLoggedIn && (
        <div className="ButtonContainer">
          <button onClick={handleViewOneImage}>Ver 1 Imagen</button>
          <button onClick={handleViewTenImages}>Ver 10 Imágenes</button>
          <button onClick={handleViewSavedImages}>Ver Cesta</button>
          <button onClick={handleViewHistory}>Historial</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
};

export default Menu;
