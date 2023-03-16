import axios from 'axios';
import {AccessToken} from '../types/AccessToken';
import {BaanBase, Baan} from '../types/Baan';
import {BaanList} from '../types/BaanList';
import {BhaaiBase, Bhaai} from '../types/Bhaai';
import {BhaaiList} from '../types/BhaaiList';
import {BhaaiTotal} from '../types/BhaaiTotal';
import {CustomerBase} from '../types/Customer';
import {Nimta} from '../types/Nimta';
import {Relative, RelativeBase} from '../types/Relative';
import {NimtaBase, NimtaList} from '../types/NimtaList';
import {Pariwar, PariwarBase} from '../types/Pariwar';
import {Profile} from '../types/Profile';
import {RelativeList} from '../types/RelativeList';
import {AddRelative} from '../types/AddRelative';
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

  async getBhaaiList(): Promise<BhaaiList> {
    return axios
      .get<BhaaiList>(`${this.baseURL}/bhaai`, this.getHeaders())
      .then(response => {
        response.data.sort((a, b) => {
          if (a.marriage < b.marriage) {
            return -1;
          }
          if (a.marriage > b.marriage) {
            return 1;
          }
          return 0;
        });

        return response.data;
      })
      .catch(this.handleError([]));
  }

  async createBhaai(bhaai: BhaaiBase): Promise<Bhaai> {
    return axios
      .post<Bhaai>(`${this.baseURL}/bhaai`, bhaai, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async updateBhaai(id: string, bhaai: BhaaiBase): Promise<Bhaai> {
    return axios
      .put<Bhaai>(`${this.baseURL}/bhaai/${id}`, bhaai, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async deleteBhaai(id: string): Promise<void> {
    return axios
      .delete<void>(`${this.baseURL}/bhaai/${id}`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async getBhaai(id: string, total: boolean = false): Promise<BhaaiTotal> {
    return axios
      .get<BhaaiTotal>(
        `${this.baseURL}/bhaai/${id}?total=${total ? 1 : 0}`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async getBaanList(bhaaiId?: string): Promise<BaanList> {
    const url = bhaaiId
      ? `${this.baseURL}/bhaai/${bhaaiId}/baan`
      : `${this.baseURL}/baan`;
    return axios
      .get<BaanList>(url, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError([]));
  }

  async createBaan(bhaaiId: string, baan: BaanBase): Promise<Baan> {
    return axios
      .post<Baan>(
        `${this.baseURL}/bhaai/${bhaaiId}/baan`,
        baan,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async updateBaan(id: string, bhaaiId: string, baan: BaanBase): Promise<Baan> {
    return axios
      .put<Baan>(
        `${this.baseURL}/bhaai/${bhaaiId}/baan/${id}`,
        baan,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async deleteBaan(id: string, bhaaiId: string): Promise<void> {
    return axios
      .delete<void>(
        `${this.baseURL}/bhaai/${bhaaiId}/baan/${id}`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
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

  async getProfile(): Promise<Profile> {
    return axios
      .get<Profile>(`${this.baseURL}/profile`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async createPariwar(pariwar: PariwarBase): Promise<Pariwar> {
    return axios
      .post<Pariwar>(`${this.baseURL}/pariwar`, pariwar, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async updatePariwar(id: string, pariwar: PariwarBase): Promise<Pariwar> {
    return axios
      .put<Pariwar>(`${this.baseURL}/pariwar/${id}`, pariwar, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async deletePariwar(id: string): Promise<void> {
    return axios
      .delete<void>(`${this.baseURL}/pariwar/${id}`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async getNimtaList(pariwarId: string): Promise<NimtaList> {
    return axios
      .get<NimtaList>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError([]));
  }

  async createNimta(pariwarId: string, nimta: NimtaBase): Promise<Nimta> {
    return axios
      .post<Nimta>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta`,
        nimta,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async updateNimta(
    id: string,
    pariwarId: string,
    nimta: NimtaBase,
  ): Promise<Nimta> {
    return axios
      .put<Nimta>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta/${id}`,
        nimta,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async deleteNimta(id: string, pariwarId: string): Promise<void> {
    return axios
      .delete<void>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta/${id}`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async getRelativeList(pariwarId: string): Promise<RelativeList> {
    return axios
      .get<RelativeList>(
        `${this.baseURL}/pariwar/${pariwarId}/relative`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError([]));
  }

  async createRelative(
    pariwarId: string,
    relative: RelativeBase,
  ): Promise<Relative> {
    return axios
      .post<Relative>(
        `${this.baseURL}/pariwar/${pariwarId}/relative`,
        relative,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async updateRelative(
    id: string,
    pariwarId: string,
    relative: RelativeBase,
  ): Promise<Relative> {
    return axios
      .put<Relative>(
        `${this.baseURL}/pariwar/${pariwarId}/relative/${id}`,
        relative,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async addRelativesInNimta(
    nimtaId: string,
    pariwarId: string,
    data: AddRelative,
  ): Promise<void> {
    return axios
      .post<void>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta/${nimtaId}/addRelative`,
        data,
        this.getHeaders(),
      )
      .then(() => {
        return;
      })
      .catch(this.handleError(undefined));
  }

  async deleteRelative(id: string, pariwarId: string): Promise<void> {
    return axios
      .delete<void>(
        `${this.baseURL}/pariwar/${pariwarId}/relative/${id}`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data;
      })
      .catch(this.handleError({}));
  }

  async removeRelativeFromNimta(
    id: string,
    nimtaId: string,
    pariwarId: string,
  ): Promise<void> {
    return axios
      .delete<void>(
        `${this.baseURL}/pariwar/${pariwarId}/nimta/${nimtaId}/removeRelative/${id}`,
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
