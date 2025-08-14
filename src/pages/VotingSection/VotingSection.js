import { useState } from "react";
import VOK from "../../VotingSection-Component/VOK/VOK";
import Votingbooth from "../../VotingSection-Component/Votingbooth/Votingbooth";

function VotingSection() {
  const [showvoting, setshowvoting] = useState(false);
  const [uid, setuid] = useState('');

  function handlevotingbooth(uid) {
    setuid(uid);
    setshowvoting(true);
  }

  return (
    <>
      {!showvoting ? (
        <VOK fetchuid={handlevotingbooth} />
      ) : (
        <Votingbooth userID={uid} />
      )}
    </>
  );
}

export default VotingSection;
