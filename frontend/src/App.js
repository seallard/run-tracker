import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route path="/home" component={Home}/>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/auth" component={SignIn} />
        </Switch>
      </div>
    </Router>
  )
}

export default App