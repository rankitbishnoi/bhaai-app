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
import mmkv from './mmkv';
import {RelativeList} from '../types/RelativeList';
import {AddRelative} from '../types/AddRelative';

class ApiService {
  baseURL =
    'http://ec2-18-179-111-175.ap-northeast-1.compute.amazonaws.com/api';
  constructor() {}

  getHeaders() {
    return {
      headers: {
        authorization: `Bearer ${mmkv.loadJWT()}`,
      },
    };
  }

  async login(loginData: CustomerBase): Promise<AccessToken> {
    console.log(loginData);
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
      .catch(error => {
        console.log(error);
        return [] as any;
      });
  }

  async createBhaai(bhaai: BhaaiBase): Promise<Bhaai> {
    return axios
      .post<Bhaai>(`${this.baseURL}/bhaai`, bhaai, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async updateBhaai(id: string, bhaai: BhaaiBase): Promise<Bhaai> {
    return axios
      .put<Bhaai>(`${this.baseURL}/bhaai/${id}`, bhaai, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async deleteBhaai(id: string): Promise<void> {
    return axios
      .delete<void>(`${this.baseURL}/bhaai/${id}`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async getBaanList(
    by: BaanBase = {} as any,
    bhaaiId?: string,
  ): Promise<BaanList> {
    const url = bhaaiId
      ? `${this.baseURL}/bhaai/${bhaaiId}/baan`
      : `${this.baseURL}/baan`;
    return axios
      .get<BaanList>(url, this.getHeaders())
      .then(response => {
        return response.data?.filter(a => {
          let truthy = true;
          if (by.firstName?.length) {
            truthy = truthy && a.firstName.includes(by.firstName);
          }
          if (by.lastName?.length) {
            truthy = truthy && a.lastName.includes(by.lastName);
          }
          if (by.address?.length) {
            truthy = truthy && a.address.includes(by.address);
          }
          if (by.fathersName?.length) {
            truthy = truthy && a.fathersName.includes(by.fathersName);
          }
          if (by.nickName?.length) {
            truthy = truthy && a.nickName.includes(by.nickName);
          }
          if (by.amount) {
            truthy = truthy && a.amount === by.amount;
          }
          return truthy;
        });
      })
      .catch(error => {
        console.log(error);
        return [] as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async searchBaan(baan: any): Promise<BaanList> {
    const queryParams = Object.keys(baan)
      .map(key => `${key}=${this.getValue(baan, key)}`)
      .join('&');
    return axios
      .get<BaanList>(`${this.baseURL}/search?${queryParams}`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return [] as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async getProfile(): Promise<Profile> {
    return axios
      .get<Profile>(`${this.baseURL}/profile`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async createPariwar(pariwar: PariwarBase): Promise<Pariwar> {
    return axios
      .post<Pariwar>(`${this.baseURL}/pariwar`, pariwar, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async updatePariwar(id: string, pariwar: PariwarBase): Promise<Pariwar> {
    return axios
      .put<Pariwar>(`${this.baseURL}/pariwar/${id}`, pariwar, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async deletePariwar(id: string): Promise<void> {
    return axios
      .delete<void>(`${this.baseURL}/pariwar/${id}`, this.getHeaders())
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return [] as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  async getRelativeList(
    pariwarId: string,
    by: RelativeBase = {} as any,
  ): Promise<RelativeList> {
    return axios
      .get<RelativeList>(
        `${this.baseURL}/pariwar/${pariwarId}/relative`,
        this.getHeaders(),
      )
      .then(response => {
        return response.data?.filter(a => {
          let truthy = true;
          if (by.firstName?.length) {
            truthy = truthy && a.firstName.includes(by.firstName);
          }
          if (by.lastName?.length) {
            truthy = truthy && a.lastName.includes(by.lastName);
          }
          if (by.address?.length) {
            truthy = truthy && a.address.includes(by.address);
          }
          if (by.fathersName?.length) {
            truthy = truthy && a.fathersName.includes(by.fathersName);
          }
          if (by.nickName?.length) {
            truthy = truthy && a.nickName.includes(by.nickName);
          }
          if (by.phoneNumber?.length) {
            truthy = truthy && a.phoneNumber.includes(by.phoneNumber);
          }
          return truthy;
        });
      })
      .catch(error => {
        console.log(error);
        return [] as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
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
      .then(res => {
        console.log(JSON.stringify(res));
        return;
      })
      .catch(error => {
        console.log(error);
        return;
      });
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
      .catch(error => {
        console.log(error);
        return {} as any;
      });
  }

  getValue(obj: any, key: string) {
    return obj[key];
  }
}

export const apiService = new ApiService();
