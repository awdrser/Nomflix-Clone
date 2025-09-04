import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv" component={Tv} />
        <Route path="/search" component={Search} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
