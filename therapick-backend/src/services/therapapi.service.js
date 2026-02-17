const axios = require('axios');

class TherapAPIService {
  constructor() {
    this.apiKey = process.env.THERAPAPI_KEY;
    this.baseURL = process.env.THERAPAPI_BASE_URL || 'https://api.therapapi.com/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  /**
   * Search for therapists based on criteria
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Array of therapists
   */
  async searchTherapists(params = {}) {
    try {
      const {
        location,
        latitude,
        longitude,
        radius = 25, // miles
        specialties = [],
        insurance = [],
        gender,
        language,
        limit = 20,
        offset = 0
      } = params;

      const queryParams = new URLSearchParams();
      
      if (location) queryParams.append('location', location);
      if (latitude && longitude) {
        queryParams.append('lat', latitude);
        queryParams.append('lng', longitude);
      }
      queryParams.append('radius', radius);
      
      if (specialties.length > 0) {
        queryParams.append('specialties', specialties.join(','));
      }
      
      if (insurance.length > 0) {
        queryParams.append('insurance', insurance.join(','));
      }
      
      if (gender) queryParams.append('gender', gender);
      if (language) queryParams.append('language', language);
      
      queryParams.append('limit', limit);
      queryParams.append('offset', offset);

      const response = await this.client.get(`/therapists?${queryParams.toString()}`);
      
      return {
        therapists: response.data.data || [],
        total: response.data.total || 0,
        hasMore: response.data.hasMore || false
      };

    } catch (error) {
      console.error('TherapAPI search error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get therapist by ID
   * @param {string} therapistId - Therapist ID
   * @returns {Promise<Object>} Therapist details
   */
  async getTherapistById(therapistId) {
    try {
      const response = await this.client.get(`/therapists/${therapistId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('TherapAPI get therapist error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get therapist reviews
   * @param {string} therapistId - Therapist ID
   * @returns {Promise<Array>} Array of reviews
   */
  async getTherapistReviews(therapistId) {
    try {
      const response = await this.client.get(`/therapists/${therapistId}/reviews`);
      return response.data.data || [];
    } catch (error) {
      console.error('TherapAPI get reviews error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get available specialties
   * @returns {Promise<Array>} Array of specialties
   */
  async getSpecialties() {
    try {
      const response = await this.client.get('/specialties');
      return response.data.data || [];
    } catch (error) {
      console.error('TherapAPI get specialties error:', error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      const err = new Error(message);
      err.statusCode = error.response.status;
      return err;
    } else if (error.request) {
      // Request made but no response received
      const err = new Error('TherapAPI service unavailable');
      err.statusCode = 503;
      return err;
    } else {
      // Error in request setup
      return error;
    }
  }
}

module.exports = new TherapAPIService();
