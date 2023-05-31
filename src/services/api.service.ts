import { AxiosError } from 'axios';
import { api } from 'src/boot/axios';
import ProductNotFound from 'src/errors/ProductNotFound';
import { Product } from 'src/types/Product';

interface RegisterResponse {
  email: string,
}

export const registerUser = async (email: string, password: string) => {
  const data = {
    email,
    password,
  };

  const response = await api.post<RegisterResponse>('/users', data);

  if (response.status === 201) {
    return response.data;
  }

  return null;
};

interface LoginResponse {
  access: string;
  refresh: string;
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>('/auth/', { email, password });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return null;
    }
  }

  return null;
};

interface RefreshResponse {
  access: string;
}

export const refreshToken = async (token: string) => {
  const data = {
    refresh: token,
  };

  const response = await api.post<RefreshResponse>('/auth/refresh', data);

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

export const createNewProduct = async (product: Product) => {
  const response = await api.post<Product>('/product/', product);

  if (response.status === 201) {
    return response.data;
  }

  return null;
};

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/product/${id}`);

  if (response.status !== 200) {
    Promise.reject(new ProductNotFound('Product not found'));
  }

  return response.data;
};

export const updateProduct = async (product: Product) => {
  const response = await api.put(`/product/${product.id}/`, product);

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/product/${id}`);

  if (response.status === 204) {
    return true;
  }

  return false;
};

interface ProductsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const getAllProducts = async (page?: number) => {
  let url = '/product/';

  if (page) {
    url += `?page=${page}`;
  }

  const response = await api.get<ProductsListResponse>(url);

  if (response.status === 200) {
    return response.data;
  }

  return null;
};
