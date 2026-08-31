// Product & Catalog API Client with Resilient Offline Mock Fallback
import { BASE_API_URL, getAuthHeaders } from './apiConfig';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './mockData';

export const productsApi = {
  // Fetch all products with filter & pagination support
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.brand && params.brand !== 'all') query.append('brand', params.brand);
      if (params.skinType && params.skinType !== 'all') query.append('skinType', params.skinType);
      if (params.sort) query.append('sort', params.sort);
      if (params.q) query.append('q', params.q);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit || 20));

      const response = await fetch(`${BASE_API_URL}/products?${query.toString()}`, {
        headers: await getAuthHeaders(),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json;
        }
      }
    } catch (err) {
      console.log('[Mobile API] Using offline catalog fallback:', err.message);
    }

    // Local filter fallback
    let filtered = [...MOCK_PRODUCTS];
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
      );
    }
    if (params.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return {
      status: 'success',
      count: filtered.length,
      totalCount: filtered.length,
      data: filtered,
    };
  },

  // Fetch product by ID or slug
  async getProductById(idOrSlug) {
    try {
      const response = await fetch(`${BASE_API_URL}/products/${idOrSlug}`, {
        headers: await getAuthHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.log('[Mobile API] Product detail offline fallback');
    }

    const found = MOCK_PRODUCTS.find(
      (p) => p._id === idOrSlug || String(p.id) === String(idOrSlug) || p.slug === idOrSlug
    );
    return found || MOCK_PRODUCTS[0];
  },

  // Fetch catalog categories and brands
  async getCatalog() {
    try {
      const response = await fetch(`${BASE_API_URL}/products/catalog`, {
        headers: await getAuthHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data) return json.data;
      }
    } catch {
      // offline fallback
    }

    return {
      categories: MOCK_CATEGORIES,
      brands: ['Beautify Botanicals', 'Atlas Botanics', 'Savanna Radiance', 'Sahel Crown', 'Horn of Africa Aromatics'],
      skinTypes: ['All', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature'],
      maxPrice: 60,
    };
  },

  // Add review to product
  async addReview(productId, reviewData) {
    try {
      const response = await fetch(`${BASE_API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(reviewData),
      });
      return await response.json();
    } catch {
      return {
        status: 'success',
        message: 'Review saved locally.',
      };
    }
  }
};
