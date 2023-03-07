import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'hunter2',
  fastWrites: true,
});

const deviceStorage = {
  saveKey(key: string, valueToSave: any) {
    try {
      storage.set(key, valueToSave);
    } catch (error: any) {
      console.log('MMKV Error: ' + error.message);
    }
  },

  loadJWT() {
    try {
      return storage.getString('id_token');
    } catch (error: any) {
      console.log('MMKV Error: ' + error.message);
    }
  },

  async deleteJWT() {
    try {
      storage.delete('id_token');
    } catch (error: any) {
      console.log('MMKV Error: ' + error.message);
    }
  },
};

export default deviceStorage;
