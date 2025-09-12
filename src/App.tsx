import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Series from "./Routes/Series";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/series" component={Series} />
        <Route path="/search" component={Search} />
        <Route path="/movies/:movieId" exact component={Home} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
