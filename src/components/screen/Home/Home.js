import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import RTCViewGrid from '../../videocall/components/VideoScreen/RTCViewGrid';
import { CallService, AuthService } from '../../videocall/services';
import ToolBar from '../../videocall/components/VideoScreen/ToolBar';
import UsersSelect from '../../videocall/components/VideoScreen/UsersSelect';
 import { users } from '../../videocall/config';
import { connect } from 'react-redux';
import navigationConstants from 'constants/navigation';

class VideoScreen extends React.Component {
  constructor(props) {
    super(props);

    this._session = null;
    this.opponentsIds = users.map(opponent => opponent.id);
    this.state = {
      localStream: null,
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
      isIncomingCall: false,
    };

    this._setUpListeners();
  }

  componentWillUnmount() {
    CallService.stopCall();
    //AuthService.logout();
  }

  componentDidUpdate(prevProps, prevState) {
    const currState = this.state;

    if (
      prevState.remoteStreams.length === 1 &&
      currState.remoteStreams.length === 0
    ) {
      CallService.stopCall();
      this.resetState();
    }
  }

  showInomingCallModal = session => {
    this._session = session;
    this.setState({ isIncomingCall: true });
  };

  hideInomingCallModal = () => {
    this._session = null;
    this.setState({ isIncomingCall: false });
  };

  // selectUser = userId => {
  //   this.setState(prevState => ({
  //     selectedUsersIds: [...prevState.selectedUsersIds, userId],
  //   }));
  // };

  // unselectUser = userId => {
  //   this.setState(prevState => ({
  //     selectedUsersIds: prevState.selectedUsersIds.filter(id => userId !== id),
  //   }));
  // };

  closeSelect = () => {
    this.setState({ isActiveSelect: false });
  };

  setOnCall = () => {
    this.setState({ isActiveCall: true });
  };

  initRemoteStreams = opponentsIds => {
    const emptyStreams = [
      {
        //userId: users[1].id,
        userId: '111',
        stream: null,
      },
    ];

    this.setState({ remoteStreams: emptyStreams });
  };

  updateRemoteStream = (userId, stream) => {
    this.setState(({ remoteStreams }) => {
      const updatedRemoteStreams = remoteStreams.map(item => {
        if (item.userId === userId) {
          return { userId, stream };
        }

        return { userId: item.userId, stream: item.stream };
      });

      return { remoteStreams: updatedRemoteStreams };
    });
  };

  removeRemoteStream = userId => {
    this.setState(({ remoteStreams }) => ({
      remoteStreams: remoteStreams.filter(item => item.userId !== userId),
    }));
  };

  setLocalStream = stream => {
    this.setState({ localStream: stream });
  };

  resetState = () => {
    this.setState({
      localStream: null,
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
    });
  };

  _setUpListeners() {
    ConnectyCube.videochat.onCallListener = this._onCallListener;
    // ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
    // ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
    // ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
    // ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
    ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
  }

  _onPressAccept = () => {
    CallService.acceptCall(this._session).then(stream => {
      const { opponentsIDs, initiatorID, currentUserID } = this._session;
      const opponentsIds = [initiatorID, ...opponentsIDs].filter(
        userId => currentUserID !== userId
      );
      // this.initRemoteStreams(users[0].id);
      this.setLocalStream(stream);
      //this.closeSelect();
      this.hideInomingCallModal();
    });
  };

  _onPressReject = () => {
    CallService.rejectCall(this._session);
    this.hideInomingCallModal();
  };

  _onCallListener = (session, extension) => {
    if (!this._session)
      CallService.processOnCallListener(session)
        .then(() => this.showInomingCallModal(session))
        .catch(this.hideInomingCallModal);
  };

  _onAcceptCallListener = (session, userId, extension) => {
    CallService.processOnAcceptCallListener(session, userId, extension)
      .then(this.setOnCall)
      .catch(this.hideInomingCallModal);
  };

  _onRejectCallListener = (session, userId, extension) => {
    CallService.processOnRejectCallListener(session, userId, extension)
      .then(() => this.removeRemoteStream(userId))
      .catch(this.hideInomingCallModal);
  };

  _onStopCallListener = (session, userId, extension) => {
    const isStoppedByInitiator = session.initiatorID === userId;

    CallService.processOnStopCallListener(userId, isStoppedByInitiator)
      .then(() => {
        if (isStoppedByInitiator) {
          this.resetState();
        } else {
          this.removeRemoteStream(userId);
        }
      })
      .catch(this.hideInomingCallModal);
  };

  _onUserNotAnswerListener = (session, userId) => {
    CallService.processOnUserNotAnswerListener(userId)
      .then(() => this.removeRemoteStream(userId))
      .catch(this.hideInomingCallModal);
  };

  _onRemoteStreamListener = (session, userId, stream) => {
    this.props.navigation.navigate(navigationConstants.video, {
      session: this._session,
      isCalling: true,
      stream: this.state.localStream,
      remote: stream,
      userId: userId,
    });
    //   CallService.processOnRemoteStreamListener(userId)
    //     .then(() => {
    //       this.updateRemoteStream(userId, stream);
    //       this.setOnCall();
    //     })
    //     .catch(this.hideInomingCallModal);
  };

  render() {
    const {
      localStream,
      remoteStreams,
      selectedUsersIds,
      isActiveSelect,
      isActiveCall,
      isIncomingCall,
    } = this.state;

    // const initiatorName = isIncomingCall
    //   ? CallService.getUserById(this._session.initiatorID, 'name')
    //   : '';
    const localStreamItem = localStream
      ? [{ userId: 'localStream', stream: localStream }]
      : [];
    const streams = [...remoteStreams, ...localStreamItem];

    CallService.setSpeakerphoneOn(remoteStreams.length > 0);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <AwesomeAlert
          show={isIncomingCall}
          showProgress={true}
          title={`Bạn có cuộc gọi video ...`}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Từ chối"
          confirmText="Chấp nhận"
          cancelButtonColor="red"
          confirmButtonColor="green"
          onCancelPressed={this._onPressReject}
          onConfirmPressed={this._onPressAccept}
          onDismiss={this.hideInomingCallModal}
          alertContainerStyle={{ zIndex: 1 }}
          titleStyle={{ fontSize: 21 }}
          cancelButtonTextStyle={{ fontSize: 18 }}
          confirmButtonTextStyle={{ fontSize: 18 }}
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps)(VideoScreen);
