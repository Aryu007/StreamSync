import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {Channel , ChannelHeader, MessageList, MessageInput, Chat , Thread, Window} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';
import CallButton from '../components/CallButton.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id : targetUserId} = useParams();

  const [ chatClient , setChatClient ] = useState(null);
  const [ channel , setChannel ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const { authUser } = useAuthUser();

  const { data : tokenData } = useQuery({
    queryKey : ['streamToken'],
    queryFn : getStreamToken,
    enabled: Boolean(authUser), // this ensures the query runs only if authUser is available
  })

  useEffect(() => {
    const initChat = async () => {
      if(!tokenData?.token || !authUser) {
        return;
      }

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePicture,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join('__');

        // You and  Me
        // if i start the chat with you, the channelId will be [myid,targetid]
        // if you start the chat with me, the channelId will be [targetid,myid]
        // That's why we need to sort the ids

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        
      } 
      catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Failed to initialize chat. Please try again later.');
      }
      finally {
        setLoading(false);
      }
    }
    initChat();
  },[tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if(loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage;
