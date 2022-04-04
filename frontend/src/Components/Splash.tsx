import React from 'react';
import ReactLoading from 'react-loading';

const Splash: React.FC = () => {
  return (
    <div id="splash">
      <div className="welcome">
        Bem-vindo à<br />
        ToDo List
      </div>
      <ReactLoading className="loading" type="spin" color="grey" height={100} width={100} />
    </div>
  );
};

export default Splash;
