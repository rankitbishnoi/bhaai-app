import axios from 'axios';
import {AccessToken} from '../types/AccessToken';
import {Baan} from '../types/Baan';
import {BaanList} from '../types/BaanList';
import {CustomerBase} from '../types/Customer';
import {store} from '../redux/configureStore';

class ApiService {
  baseURL =
    'http://ec2-18-179-111-175.ap-northeast-1.compute.amazonaws.com/api';
  constructor() {}

  getHeaders() {
    return {
      headers: {
        authorization: `Bearer ${store.getState().profile.token}`,
      },
    };
  }

  async login(loginData: CustomerBase): Promise<AccessToken> {
    return axios
      .post<AccessToken>(`${this.baseURL}/auth/login`, loginData)
      .then(response => {
        return response.data;
      });
  }

  async signup(signupData: CustomerBase): Promise<boolean> {
    return axios
      .post<boolean>(`${this.baseURL}/auth/signup`, signupData)
      .then(() => {
        return true;
      });
  }

  async searchBaan(input: string): Promise<BaanList> {
    return axios
      .get<BaanList>(
        `${this.baseURL}/search?searchBy=${input}`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError([]));
  }

  async giveBaan(baanId: string, amount: number): Promise<Baan> {
    return axios
      .post<Baan>(
        `${this.baseURL}/giveBaan`,
        {
          amount,
          baanId,
        },
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  handleError(returnObj: any) {
    return (error: any) => {
      if (error.response.data?.type === 'NOT_AUTHENTICATED') {
        throw error.response.data;
      }

      return returnObj;
    };
  }
}

export const apiService = new ApiService();
