// src/ImageListWithLimit.js
import React, { useEffect, useState } from 'react';
import { getImagesLimit } from './api';

function ImageListWithLimit({ limit }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const data = await getImagesLimit(limit);
      setImages(data);
    }

    fetchImages();
  }, [limit]);

  return (
    <div>
      <h2>Lista de Imágenes (límite: {limit})</h2>
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

export default ImageListWithLimit;
