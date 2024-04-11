// src/ImageList.js
import React, { useEffect, useState } from 'react';
import { getImages } from './api';

function ImageList() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const data = await getImages();
      setImages(data);
    }

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Lista de Imágenes</h2>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <img src={image.url} alt={`Image ${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImageList;
