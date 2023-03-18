import React from 'react';
import {
  Image,
  ImageProps,
  ImageURISource,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppSelector} from '../../redux/hooks';
import {styles} from '../../styles/theme';
import UserAvatar from 'react-native-user-avatar';

interface AvatarProps extends ImageProps {
  name: string;
  onChange?: (file: ImageOrVideo) => void;
}

export const Avatar = (props: AvatarProps) => {
  const theme = useAppSelector(state => state.theme.mode);
  const themeStyles = styles[theme === 'dark' ? 'dark' : 'light'];
  const [uri, setUri] = React.useState(
    (props.source as ImageURISource)?.uri || undefined,
  );
  const [visible, setVisible] = React.useState(false);
  const close = () => setVisible(false);
  const open = () => setVisible(true);
  const chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
        props.onChange?.(image);
      })
      .catch(err => console.log(err))
      .finally(close);
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
        props.onChange?.(image);
      })
      .catch(err => console.log(err))
      .finally(close);
  };
  console.log(uri);
  return (
    <>
      <TouchableOpacity style={avatarStyles.container} onPress={open}>
        {uri ? (
          <Image
            style={avatarStyles.avatar}
            source={uri ? {uri} : props.source}
          />
        ) : (
          <UserAvatar
            size={100}
            name={props.name}
            style={avatarStyles.avatar}
          />
        )}
      </TouchableOpacity>
      <Modal
        isVisible={visible}
        onBackButtonPress={close}
        onBackdropPress={close}
        style={avatarStyles.model}>
        <SafeAreaView
          style={{
            ...avatarStyles.options,
            backgroundColor: themeStyles.backgroundSecondary,
          }}>
          <Pressable style={avatarStyles.option} onPress={chooseImage}>
            <Ionicons
              name="image-outline"
              size={25}
              color={themeStyles.primary}
            />
            <Text style={{color: themeStyles.primary}}>Library </Text>
          </Pressable>
          <Pressable style={avatarStyles.option} onPress={openCamera}>
            <Ionicons
              name="camera-outline"
              size={25}
              color={themeStyles.primary}
            />
            <Text style={{color: themeStyles.primary}}>Camera</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const avatarStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  avatar: {
    paddingTop: 20,
    height: 100,
    width: 100,
    borderRadius: 100,
    padding: 20,
  },
  options: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  model: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
