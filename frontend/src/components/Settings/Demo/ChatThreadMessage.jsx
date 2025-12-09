import Lottie from "lottie-react";
import React, { useState } from "react";
import * as typingLottie from "../../../assets/lotties/typing-lottie.json";
import formatTime from "../../../utilities/formatTime";

const ChatThreadMessage = ({
  message,
  allMessages,
  messageLoading,
  messageLoadingKey,
}) => {
  const contactMsgLoading = messageLoading && messageLoadingKey === message.key;

  const [completedTyping, setCompletedTyping] = useState(true);
  const [displayResponse, setDisplayResponse] = useState(true);
  const [animationMsgKey, setAnimationMsgKey] = useState(null);

  //handles the typing animation
  // useEffect(() => {
  //   if (!allMessages || allMessages.length == 0) return;
  //   let i = 0;
  //   const lastMessage = allMessages[allMessages.length - 1];
  //   if (lastMessage?.sentBy !== 'AI' || !lastMessage?.key) return;
  //   setCompletedTyping(false);
  //   setAnimationMsgKey(lastMessage?.key);
  //   const stringResponse = lastMessage?.content;
  //   const intervalId = setInterval(() => {
  //     setDisplayResponse(stringResponse.slice(0, i));
  //     i++;
  //     if (i > stringResponse.length) {
  //       clearInterval(intervalId);
  //       setCompletedTyping(true);
  //     }
  //   }, 30);
  //   return () => clearInterval(intervalId);
  // }, [allMessages]);

  const renderMessageLinks = () => {
    const aTags = [];
    message?.links?.map((link) => {
      aTags.push(<a href={link}>{link}</a>);
    });
    return aTags;
  };

  if (message.sentBy === "CONTACT")
    return (
      <React.Fragment>
        <div className="krispy-msg-right">
          <div className="krispy-right-msg my-1 font-inter d-flex">
            {message?.content}
            <div
              className="text-end text-[#7C7C7C] d-flex items-end"
              style={{ height: "40px" }}
            >
              {formatTime(message?.msgTimestamp)}
            </div>
          </div>
        </div>
        {contactMsgLoading && (
          <div className="krispy-msg-block">
            <div className="krispy-msg font-inter my-1 d-flex ">
              <Lottie
                animationData={typingLottie}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid slice",
                }}
                loop={true}
                autoplay={true}
                style={{ height: 30, width: 120 }}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  else
    return (
      <div className="krispy-msg-block">
        <div className="krispy-msg font-inter my-1 flex flex-col whitespace-pre-wrap">
          {message?.content}
          {/* {!completedTyping && animationMsgKey === message?.key ? displayResponse :
              message.content?.startsWith('https://') ?
                <a href={message?.content} target='__blank'>{message?.content}</a>
                : message?.content
            }
            {!completedTyping && animationMsgKey === message?.key && (
              <svg
                viewBox="8 4 8 16"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor"
              >
                <rect x="10" y="6" width="4" height="12" fill="#000000" />
              </svg>
            )} */}
          <div className="text-end text-[#7C7C7C] d-flex items-end">
            {formatTime(message?.msgTimestamp)}
          </div>
        </div>
      </div>
    );
};

export default ChatThreadMessage;
