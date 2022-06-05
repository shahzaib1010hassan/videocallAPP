import React, {Component} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {FAB} from 'react-native-paper';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2596be',
    accent: '#AAFF00',
  },
};
export default class Home extends Component {
  currentUserID;
  currentUserName;
  currentUserIcon =
    'https://cdn-icons.flaticon.com/png/512/2785/premium/2785482.png?token=exp=1654021363~hmac=33b40f8af886abdf937337ed21a01d1b'; // TODO for test only
  serverUrl;
  appData;
  state = {
    targetUserID: '',
  };
  constructor(props) {
    super(props);
    console.log('Home constructor: ', props);
    this.appData = props.appData;
    this.currentUserID = this.appData.userID;
    this.currentUserName = this.currentUserID.toUpperCase(); // TODO user name for test only
    this.serverUrl = this.appData.serverUrl;
  }
  // Call by Routes's instance which would be trigger in the APP component by user click the notification
  handleIncomingCall(roomID) {
    this.jumpToCallPage(roomID);
    console.log('Handle incoming call with room id: ', roomID);
  }
  // Post a request to backend service will the targetUserID
  // Because every device(FCM token) has been binding with a specific user id at APP launched,
  // so the server can find out who you are trying to call
  async sendCallInvite(roomID) {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        targetUserID: this.state.targetUserID,
        callerUserID: this.currentUserID,
        callerUserName: this.currentUserName,
        callerIconUrl: this.currentUserIcon,
        roomID: roomID,
        callType: 'Video', // TODO For test only
      }),
    };
    const reps = await fetch(`${this.serverUrl}/call_invite`, requestOptions);
    console.log('Send call invite reps: ', reps);
  }
  jumpToCallPage(roomID) {
    Actions.call({
      appData: this.appData,
      roomID: roomID,
      userName: this.currentUserName,
    });
  }
  // Start call by click the call button
  startCall() {
    if (this.state.targetUserID == '') {
      console.warn('Invalid user id');
      return;
    }
    // TODO the caller use he/her own user id to join room, for test only
    this.jumpToCallPage(this.currentUserID);
    this.sendCallInvite(this.currentUserID);
  }

  render() {
    return (
      <View style={[styles.homePage, styles.showPage]}>
        <FAB
          style={styles.fab}
          label="Call"
          onPress={this.startCall.bind(this)}
          color="white"
          uppercase
          theme={theme}
          labelStyle={{fontSize: 24}}
        />
        <ImageBackground
          source={require('./Images/Background.png')}
          resizeMode="cover"
          style={styles.image}>
          <Text style={styles.logo}>Sehat Markaz</Text>
          <View
            style={[
              styles.container,
              {
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <View
              style={[
                styles.inputBox,
                styles.container,
                {flexDirection: 'row'},
              ]}>
              <Text style={[styles.text, {fontSize: 22}]}>
                Your Calling Id ( {this.currentUserID} )
              </Text>
            </View>

            <View
              style={[
                styles.inputBox,
                styles.container,
              ]}>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  this.setState({targetUserID: text});
                }}
                placeholder="Receiver Client Id"
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // ZegoEasyExample
  homePage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  showPage: {
    display: 'flex',
  },
  hidePage: {
    display: 'none',
  },
  logo: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '400',
    marginTop: '50%',
    marginBottom: 100,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'Rubik',
  },
  ctrlBtn: {
    width: '40%',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    width: '100%',
    height: 35,
    borderWidth: 1,
    padding: 10,
  },
  inputBox: {
    width: '75%',
    height: 50,
    alignSelf:'center'
  },
});
