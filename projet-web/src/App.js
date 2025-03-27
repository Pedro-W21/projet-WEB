import image_logo_insa from './logo-ng.png'
import './App.css';


import React from 'react';
import axios from 'axios';
import InventoryTable from './components/InventoryTable';
import AddItemForm from './components/AddItemForm';

function App() {
  const [items, setItems] = React.useState([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showPopup, setShowPopup] = React.useState(false);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inventory');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const real_items = items.map((item) => ({
        name:item.name,
        quantity: item.quantity,
        bestBy: item.bestBy
      }));
      await axios.post('http://localhost:3000/api/inventory', real_items);
      alert('Inventory saved successfully!');
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert('Error saving inventory. Please try again.');
    }
  };

  const handleAddItem = (newItem) => {
    setItems((prevItems) => {
      //cherche s'il existe déjà un élément avec le même nom ET la même date de péremption, pour les combiner
      const existingItem = prevItems.find(
        (item) => item.name === newItem.name && item.bestBy === newItem.bestBy
      );
      if (existingItem) {
        //si un élément comme ça existe, on met à jour sa quantité pour prendre en compte celle qu'on ajoute
        return prevItems.map((item) =>
          item === existingItem
            ? { ...item, quantity: String(Number(item.quantity) + Number(newItem.quantity)) } // On additionne les quantités
            : item
        );
      } else {
        //sinon, le nouvel ingrédient est ajouté normalement
        return [...prevItems, newItem];
      }
    });
    setShowAddForm(false);
  };

  const handleRecettesClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <div>
        <h1>INSApprovisionnement</h1>
      </div>
      <div className = "Partie-fonctionnelle">
        <div className="Ajoute-produit">
          <AddItemForm onSubmit={handleAddItem} onCancel={handleAddItem}/>
        </div>
        <div className="Tableau-et-boutons">
          <InventoryTable items={items} setItems={setItems} loading={loading} />
          <div className = "Boutons-en-bas">
            <button className="Bouton-tableau" onClick={handleSave}>
              Sauvegarder 
            </button>
            <button className="Bouton-tableau" onClick={fetchInventory}>
              Version la plus récente
            </button>
            <button className="Bouton-tableau" onClick={handleRecettesClick}>
              Vos recettes
            </button>
          </div>
        </div>
      </div>
      {showPopup && (
      <>
      <div className="popup-overlay" onClick={closePopup}></div>
        <div className="popup">
          <div className="popup-content">
            <h2>Recettes Disponibles</h2>
              <ul>
                <li>Recette 1: Salade de fruits</li>
                <li>Recette 2: Soupe aux légumes</li>
                <li>Recette 3: Pâtes à la tomate</li>
              </ul>
            <button onClick={closePopup}>Fermer</button>   
          </div>
        </div>
      </>
      )}
      <footer className="BasDePage">
        <img src={image_logo_insa} alt="logo INSA" className="INSA-logo"/>
      </footer>
    </div>
    
  );
}

export default App;
