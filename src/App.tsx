import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GameScreen from "./screens/game-screen";
import HomeScreen from "./screens/home-screen";
import routes from "./utils/route-config.json";
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={routes.home}>
          <HomeScreen />
        </Route>
        <Route exact path={routes.game}>
          <GameScreen />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
