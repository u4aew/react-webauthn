import React, { useCallback, useState, useMemo } from 'react';
import {useWebAuthn} from 'react-hook-webauthn'
import './App.css';
// @ts-ignore
import { QRCode, QRSvg } from 'sexy-qr';
import Links from "./components/Links";

const rpOptions = {
  rpId: 'webauthn.fancy-app.site',
  rpName: 'my super app'
}

function App() {
  const [login, setLogin] = useState('Login')
  const {getCredential, getAssertion} = useWebAuthn(rpOptions)

  const onChangeLogin = useCallback((e: any) => {
    setLogin(e.target.value)
  }, [])

  const onRegister = useCallback(async  () => {
    const credential = await getCredential({
      challenge: 'stringFromServer',
      userDisplayName: login,
      userId: login,
      userName: login
    })
    console.log(credential)
  }, [getCredential, login])

  const onAuth = useCallback(async () => {
    const assertion =  await getAssertion({challenge: 'stringFromServer'})
    console.log(assertion)
  }, [getAssertion])

  const qrCode = useMemo(() => {
    const qr =  new QRCode({
      content: window.location.href,
      ecl: 'M'
    });
    return new QRSvg(qr, {
      fill: '#182026',
      cornerBlocksAsCircles: true,
      size: 200,
      radiusFactor: 0.75,
      cornerBlockRadiusFactor: 2,
      roundOuterCorners: true,
      roundInnerCorners: true,
    }).svg
  }, [])

  return (
    <div className="App">
      <main>
        <div className="title">
          Webauthn demo
        </div>
        <div className={'qrCode'} dangerouslySetInnerHTML={{ __html: qrCode }} />
        <div className="section">
          <input onInput={onChangeLogin} placeholder="login" type="text"/>
        </div>
         <div className="section">
           <button onClick={onRegister} type="button">register</button>
         </div>
        <div className="del"/>
        <div className="section">
          <button onClick={onAuth} type="button">auth</button>
        </div>
        <Links />
      </main>
    </div>
  );
}

export default App;
