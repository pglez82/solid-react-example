import './App.css';
import { SessionProvider} from "@inrupt/solid-ui-react";
import { useState} from "react";
import LoginForm from "./components/LoginForm"
import ProfileViewer from "./components/ProfileViewer"

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogin = () => {
    setIsLoggedIn(true)
  }

  const onLogout = () => {
    console.log("Calling on logout")
    setIsLoggedIn(false)
  }
  
  return(
    <SessionProvider sessionId="log-in-example">
      {(!isLoggedIn) ? <LoginForm onLogin={onLogin} /> : <ProfileViewer onLogout={onLogout}/>}
    </SessionProvider>
  )
}

export default App;
