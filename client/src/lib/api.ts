const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

// Define the API routes in a structured way
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`,
  },
  MATERIAL_INVOICES: {
    LIST_MATERIAL_INVOICES: `${BASE_URL}/user/list/material-invoices`,
    CREATE_MATERIAL_INVOICE: `${BASE_URL}/user/create/material-invoice`,
    UPDATE_MATERIAL_INVOICE: (id: string) => `${BASE_URL}/user/update/material-invoice/${id}`,
    DELETE_MATERIAL_INVOICE: (id: string) => `${BASE_URL}/user/delete/material-invoice/${id}`,
    GET_MATERIAL_INVOICE: (id: string) => `${BASE_URL}/user/get/material-invoice/${id}`,
    APPROVE_MATERIAL_INVOICE: `${BASE_URL}/user/approve/material-invoice`,
  },
  MATERIAL_DCS: {
    LIST_MATERIAL_DCS: `${BASE_URL}/user/list/dc-entries`,
    CREATE_MATERIAL_DC: `${BASE_URL}/user/create/dc-entry`,
    APPROVE_MATERIAL_DC: `${BASE_URL}/user/approve/dc-entry`,
  },
} as const;

export const localKey = {
  token: `store-app-token`,
}

