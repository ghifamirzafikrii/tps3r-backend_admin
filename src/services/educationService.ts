import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

// Types
export interface Education {
  id: number;
  title: string;
  content: string;
  thumbnail_url?: string | null;
  status: 'published' | 'draft';

  author?: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    avatar_url?: string;
  };

  created_at: string;
  updated_at?: string;
}

// GET /api/educations - Laravel paginated response
export interface EducationListResponse {
  data: Education[];
  links: Record<string, string>;
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// POST/PUT /api/educations - Laravel resource response
export interface EducationResponse {
  success: boolean;
  message: string;
  education: Education;
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('tps3r_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Education Service
export const educationService = {
  /**
   * Get all educations
   * GET /api/educations
   */
  getAll: async (): Promise<Education[]> => {
    console.log('[educationService] getAll called');
    try {
      const response = await axios.get<EducationListResponse>(`${BASE_URL}/educations`, {
        headers: {
          ...getAuthHeaders(),
          'Accept': 'application/json',
        },
        timeout: 30000,
      });
      console.log('[educationService] getAll response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('[educationService] getAll error:', error);
      throw error;
    }
  },

  /**
   * Create education
   * POST /api/educations
   */
  create: async (data: {
    title: string;
    content: string;
    status: 'published' | 'draft';
    thumbnail?: File | null;
  }): Promise<Education> => {
    console.log('[educationService] create called:', data.title);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('status', data.status);
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    const response = await axios.post<EducationResponse>(`${BASE_URL}/educations`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    console.log('[educationService] create response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Gagal membuat artikel');
    }
    return response.data.education;
  },

  /**
   * Update education
   * POST /api/educations/{id}?_method=PUT
   */
  update: async (
    id: number,
    data: {
      title?: string;
      content?: string;
      status?: 'published' | 'draft';
      thumbnail?: File | null;
    }
  ): Promise<Education> => {
    console.log('[educationService] update called:', id, data);
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);
    if (data.status) formData.append('status', data.status);
    if (data.thumbnail !== undefined && data.thumbnail !== null) {
      formData.append('thumbnail', data.thumbnail);
    }

    const response = await axios.post<EducationResponse>(
      `${BASE_URL}/educations/${id}?_method=PUT`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    console.log('[educationService] update response:', response.data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Gagal memperbarui artikel');
    }
    return response.data.education;
  },

  /**
   * Delete education
   * DELETE /api/educations/{id}
   */
  delete: async (id: number): Promise<void> => {
    console.log('[educationService] delete called:', id);
    await axios.delete(`${BASE_URL}/educations/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
      timeout: 30000,
    });
    console.log('[educationService] delete success:', id);
  },
};

export default educationService;
