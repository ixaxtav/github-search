import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {NavbarGithub} from './components/navbar'
import {SearchBar} from './components/searchbar'


function App() {
  return (
    <div>
      <NavbarGithub title="Ixax Github Search"/>
      <div className="container-fluid">
        <SearchBar/>
      </div>
    </div>
  );
}

export default App;
