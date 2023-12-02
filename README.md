[![npm version](https://badge.fury.io/js/react-hook-webauthn.svg)](https://badge.fury.io/js/react-hook-webauthn)
# React-hook-webauthn
Simple Hook for react, serverless use of webAuthn

A detailed setup process can be read in this [article](https://dev.to/u4aew/adding-webauthnto-the-web-application-59gp).

![demo](./img/demo.gif)

## Installing as a package

```
npm i react-hook-webauthn
```

## Usage

```js
import React, { useCallback, useState } from 'react';
import {useWebAuthn} from 'react-hook-webauthn'
import './App.css';

const rpOptions = {
  rpId: 'localhost',
  rpName: 'my super app'
}

function App() {
  const [login, setLogin] = useState('')
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

  return (
    <div className="App">
      <main>
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
      </main>
    </div>
  );
}

export default App;
```

## Options
| name            | type   | required |
|-----------------|--------|----------|
| rpName          | string | true     |
| rpId            | string | true     |
| userName        | string | true     |
| userDisplayName | string | true     |
| challenge       | string | true     |
| credentialOpt   | object | false    |
| assertionOpt    | object | false    |
