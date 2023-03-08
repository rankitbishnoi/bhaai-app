import React, {useContext, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {apiService} from '../services/api.service';
import {
  IconButton,
  ListItem,
  Stack,
  TextInput,
} from '@react-native-material/core';

import useStyles from '../styles/baan';
import {Baan as BaanType} from '../types/Baan';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from '../components/loader';
import {BaanBase} from '../types/BaanList';
import GiveBaan from '../components/giveBaan';
import AppContext from '../services/storage';
import useStackBarStyles from '../styles/stackBar';

interface SearchProps {
  setSearchVisible: (visiblity: boolean) => any;
  reloadList?: () => any;
}

const Search: React.FC<SearchProps> = ({setSearchVisible, reloadList}) => {
  const myContext = useContext(AppContext);
  const styles = useStyles();
  const stackBarStyles = useStackBarStyles();
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(false);
  const [giveBaanVisible, setGiveBaanVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedBaan, setSelectedBaan] = useState({} as any);

  const search = async (input: string) => {
    setLoading(true);
    const baanList = await apiService.searchBaan({firstName: input});
    setData({baanList});
    setLoading(false);
  };

  const openGiveBaan = (baan: BaanBase) => {
    setSelectedBaan(baan);
    setGiveBaanVisible(true);
  };

  const showMessage = (reason: string) => {
    if (reason === 'GIVEN') {
      myContext.setAppSettings({
        ...myContext.appSettings,
        message: 'Baan has been given',
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ProgressBar height={5} indeterminate backgroundColor="#4a0072" />
      )}
      <TextInput
        variant="outlined"
        label="Search"
        style={{margin: 16}}
        value={searchText}
        onChangeText={newText => setSearchText(newText)}
        trailing={props => (
          <TouchableOpacity onPress={() => search(searchText)}>
            <Ionicons name="search" {...props} />
          </TouchableOpacity>
        )}
      />
      {data?.baanList &&
        data.baanList.map((baan: BaanType) => (
          <ListItem
            key={baan._id}
            title={`${baan.firstName} ${baan.lastName}${
              baan.nickName ? '(' + baan.nickName + ')' : ''
            } ${baan.fathersName ? 'S/O ' + baan.fathersName : ''}, ${
              baan.address
            }`}
            secondaryText={`Rs: ${baan.amount}`}
            style={styles.list}
            elevation={4}
            leadingMode="avatar"
            leading={
              <TouchableOpacity onPress={() => openGiveBaan(baan)}>
                <Ionicons color={'white'} style={{fontSize: 50}} name="add" />
              </TouchableOpacity>
            }
          />
        ))}
      <Stack
        style={stackBarStyles.stackBar}
        fill
        bottom={1}
        right={1}
        spacing={4}>
        <IconButton
          onPress={() => {
            reloadList && reloadList();
            setSearchVisible(false);
          }}
          icon={props => <Ionicons name="arrow-back-outline" {...props} />}
          color="secondary"
          style={stackBarStyles.fab}
        />
      </Stack>
      {giveBaanVisible && (
        <GiveBaan
          visible={giveBaanVisible}
          setVisible={setGiveBaanVisible}
          showMessage={showMessage}
          data={selectedBaan}
        />
      )}
    </View>
  );
};

export default Search;
