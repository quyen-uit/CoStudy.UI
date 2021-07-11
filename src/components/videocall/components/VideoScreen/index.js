import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import RTCViewGrid from './RTCViewGrid';
import { CallService, AuthService } from '../../services';
import ToolBar from './ToolBar';
import UsersSelect from './UsersSelect';
import { users } from 'components/videocall/config';
import { connect } from 'react-redux';

class VideoScreen extends React.Component {
  constructor(props) {
    super(props);

    // this.opponentsIds = users.map(opponent => opponent.id);

    this.state = {
      localStream: null,
      remoteStreams: [],
      selectedUsersIds: [],
      isActiveSelect: true,
      isActiveCall: false,
      isIncomingCall: false,
    };

    this._setUpListeners();

    if (this.props.route.params.isCalling) {
      //this._session = this.props.route.params.session;
      //CallService.processOnCallListener(this.props.route.params.session)
      //.then(() => this.showInomingCallModal(this.props.route.params.session))
      // console.log('------------------------------------------');
      // console.log(this.props.route.params.session);
      // this._onPressAccept();
    } else {
      this._session = null;
      ConnectyCube.videochat.onCallListener = this._onCallListener;
      ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
    }
  }
  componentDidMount() {
    this.opponentsIds = [this.props.route.params.opponent_id];
    this.setState({ selectedUsersIds: this.opponentsIds });
    if (this.props.route.params.isCalling) {
      this._session = this.props.route.params.session;
      this.initRemoteStreams(this.props.route.params.opponent_id);
      this.updateRemoteStream(
        this.props.route.params.userId,
        this.props.route.params.remote
      );
      this.setOnCall();
      this.setLocalStream(this.props.route.params.stream);
      // console.log('------------------------------------------');
      // console.log(this.props.route.params.session);
      // this._onPressAccept();
    }
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
    if (this.props.route.params.isCalling) {
      const emptyStreams = [
        {
          userId: this.props.route.params.userId,
          stream: null,
        },
      ];
      this.setState({ remoteStreams: emptyStreams });

    } else {
      const emptyStreams = [
        {
          userId: this.props.route.params.opponent_id,
          stream: null,
        },
      ];
      this.setState({ remoteStreams: emptyStreams });

    }
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
    // ConnectyCube.videochat.onCallListener = this._onCallListener;
    ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
    ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
    ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
    ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
    // ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
  }

  _onPressAccept = () => {
    CallService.acceptCall(this._session).then(stream => {
      const { opponentsIDs, initiatorID, currentUserID } = this._session;
      const opponentsIds = [initiatorID, ...opponentsIDs].filter(
        userId => currentUserID !== userId
      );
      this.initRemoteStreams(this.props.route.params.opponent_id);
      this.setLocalStream(stream);
      this.closeSelect();
      this.hideInomingCallModal();
    });
  };

  _onPressReject = () => {
    CallService.rejectCall(this._session);
    this.hideInomingCallModal();
  };

  _onCallListener = (session, extension) => {
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
    this.props.navigation.goBack();
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
    this.props.navigation.goBack();
  };

  _onUserNotAnswerListener = (session, userId) => {
    CallService.processOnUserNotAnswerListener(userId)
      .then(() => this.removeRemoteStream(userId))
      .catch(this.hideInomingCallModal);
  };

  _onRemoteStreamListener = (session, userId, stream) => {
    CallService.processOnRemoteStreamListener(userId)
      .then(() => {
        console.log('on remote stream 2');
        this.updateRemoteStream(userId, stream);
        this.setOnCall();
      })
      .catch(this.hideInomingCallModal);
  };
  goBack = () => {
    this.props.navigation.goBack();
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <RTCViewGrid streams={streams} />
        {/* <UsersSelect
          isActiveSelect={isActiveSelect}
          opponentsIds={this.opponentsIds}
          selectedUsersIds={selectedUsersIds}
          selectUser={this.selectUser}
          unselectUser={this.unselectUser}
        /> */}
        <ToolBar
          selectedUsersIds={[this.props.route.params.opponent_id]}
          localStream={localStream}
          isActiveSelect={isActiveSelect}
          isActiveCall={isActiveCall}
          closeSelect={this.closeSelect}
          initRemoteStreams={this.initRemoteStreams}
          setLocalStream={this.setLocalStream}
          resetState={this.resetState}
          goBack={this.goBack}
          isCalling={this.props.route.params.isCalling}
        />
        <AwesomeAlert
          show={isIncomingCall}
          showProgress={false}
          title={`Bạn có cuộc gọi đến ...`}
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
