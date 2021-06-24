import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AuthContextProvider } from './contexts/AuthContext';
import { AdminRoom } from './pages/AdminRoom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/rooms/new" component={NewRoom}/>
            <Route path="/rooms/:id" component={Room}/>
            <Route path="/admin/rooms/:id" component={AdminRoom}/>
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;