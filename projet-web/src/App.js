import logo from './logo.svg';
import image_logo_insa from './logo-ng.png'
import './App.css';

function App() {
  return (
    <div className="App">
      <div>
        <h1>INSApprovisionnement</h1>
      </div>
      <div class = "Partie-fonctionnelle">
        <div class="Ajoute-produit">
          <h2>Ajouter Produit</h2>
          <input class="Inventory-input" type="text" value="Nom du produit"></input>
          <input class="Inventory-input" type="number" value="1"></input>
          <input class="Inventory-input" type="date" value="Date de péremption"></input>
          <button class="Inventory-input-button">Entrer</button>
        </div>
        <div class="Tableau-et-boutons">
          <div class="Tableau">
           <h2>L'inventaire</h2>
           <div class="Inventory-row">
            <h3 class="Inventory-cell">Produit</h3>
            <h3 class="Inventory-cell">Quantité</h3>
            <h3 class="Inventory-cell">Date de péremption</h3>
           </div>
          </div>
          <div class = "Boutons-en-bas">
            <button class="Bouton-tableau">
              Sauvegarder
            </button>
            <button class="Bouton-tableau">
              Version la plus récente
            </button>
          </div>
        </div>
      </div>
      <header class="App-header">
        <img src={logo} class="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <footer class="BasDePage">
        <img src={image_logo_insa} alt="logo INSA" className="INSA-logo"/>
      </footer>
    </div>
    
  );
}

export default App;
