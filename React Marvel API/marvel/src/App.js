import React from 'react';
import './App.css';
import logo from './img/logo.webp';
import Characters from './components/Characters';
import CharactersList from './components/CharactersList';
//import CharactersSearch from './components/CharactersSearch';
import Comics from './components/Comics';
import ComicsList from './components/ComicsList';
//import ComicsSearch from './components/ComicsSearch';
import Series from './components/Series'; 
import SeriesList from './components/SeriesList'; 
//import SeriesSearch from './components/SeriesSearch';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
        <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>Welcome to the MARVEL API </h1>
            <Link className='showlink' to='/characters/page/0'>
              Characters
            </Link>
            <Link className='showlink' to='/comics/page/0'>
              Comics
            </Link>
            <Link className='showlink' to='/series/page/0'>
              Series
            </Link>
        </header>
        <br/>
        <br/>
        <div className='App-body'>
          <Routes>
            <Route exact path='/characters/:id' element={<Characters/>} />
            <Route exact path='/characters/page/:pageNo' element={<CharactersList/>} />
            <Route exact path='/comics/:id' element={<Comics/>} />
            <Route exact path='/comics/page/:pageNo' element={<ComicsList/>} />
            <Route exact path='/series/:id' element={<Series/>} />
            <Route exact path='/series/page/:pageNo' element={<SeriesList/>} />
          </Routes>
        </div>
        </Router>
      </div>
  );
}

export default App;
