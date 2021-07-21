import Movies from './Component/Movies'
import About from './Component/About';
import Home from './Component/Home';
import Nav from './Component/Nav';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {
  return (
    <Router>
      <Nav/>
      <Switch>
        {/* <Home/> */}
        <Route path='/' exact component={Home}></Route> 
       
        {/* <Movies/> */}
        <Route path='/movies' exact component={Movies}></Route>
        {/* <Route exact path='/about' component={About}/> */}
  <Route path='/about' render={(props)=>{ return <About {...props} isAuth={true} />}}/>
  </Switch>
    </Router>

  );
}

export default App;
