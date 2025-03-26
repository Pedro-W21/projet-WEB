import logo from './logo.svg';
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

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddForm(false);
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
          </div>
        </div>
      </div>
      <footer className="BasDePage">
        <img src={image_logo_insa} alt="logo INSA" className="INSA-logo"/>
      </footer>
    </div>
    
  );
}

export default App;
