// src/api.js
const BASE_URL = 'http://localhost:8080'; // El puerto puede variar según la configuración de tu servidor Maven

export async function getImages() {
  const response = await fetch(`${BASE_URL}/cat/image`);
  return await response.json();
}

export async function getImagesLimit(limit) {
  const response = await fetch(`${BASE_URL}/cat/images?limit=${limit}`);
  return await response.json();
}
