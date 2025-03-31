import image_logo_insa from './logo-ng.png'
import './App.css';


import React from 'react';
import axios from 'axios';
import InventoryTable from './components/InventoryTable';
import AddItemForm from './components/AddItemForm';
import ConnectForm from './components/ConnectForm';
import { CookiesProvider, useCookies } from 'react-cookie'

function App() {
  const [items, setItems] = React.useState([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showPopup, setShowPopup] = React.useState(false);
  const [groupID, setGroupID] = React.useState("");
  const [groups, setGroups] = React.useState([]);

  const fetchInventory = async (group_id) => {
    try {
      let right_group = "";
      if ((typeof group_id) === 'string') {
        right_group = group_id;
      }
      else {
        right_group = groupID;
      }
      if (right_group != "") {
        const response = await axios.post('http://localhost:3000/api/group_inventories', {group_id:right_group});
        setItems(response.data);
      }
      else {
        alert("Il faut choisir un groupe pour en récupérer l'inventaire");
      }
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      if (groupID != "") {
        const real_items = items.map((item) => ({
          name:item.name,
          quantity: item.quantity,
          bestBy: item.bestBy,
          group_id:groupID
        }));
        await axios.post('http://localhost:3000/api/inventory', {group_id:groupID,items:real_items});
        alert('Inventaire sauvegardé!');
      
      }
      else {
        alert('Pas de groupe choisi !');
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert('Erreur serveur lors de la sauvegarde.');
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

  const handleGroupConnect = async (chosen_group, creating) => {
    await fetchGroups();
    if (creating) {
      if (groups.filter((group) => group.group_id == chosen_group).length == 0) {
        try {
          if (chosen_group != "") {
            console.log([...groups, {group_id:chosen_group}]);
            await axios.post('http://localhost:3000/api/groups', [...groups, {group_id:chosen_group}]);
            setGroups([...groups, {group_id:chosen_group}])
            setGroupID(chosen_group);
            alert('Groupe sauvegardé !');
          
          }
          else {
            alert('Pas de groupe choisi !');
          }
        } catch (error) {
          console.error('Error saving group:', error);
          alert('Erreur serveur lors de la sauvegarde du groupe.');
        }
      }
      else {
        alert("Ce groupe existe déjà ! Vous voulez peut-être vous connecter ?")
      }
    }
    else if (groups.filter((group) => group.group_id == chosen_group).length == 0) {
      alert("Group doesn't exist !")
    }
    else {
      setGroupID(chosen_group);
      alert("Connecté au groupe !");
      fetchInventory(chosen_group);
    }
    
  }

  const handleRecettesClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <CookiesProvider>
        <div>
          <h1>INSApprovisionnement</h1>
        </div>
        <div className = "Partie-fonctionnelle">
          <div className="form-column">
            <ConnectForm onSubmit={handleGroupConnect} onCancel={handleGroupConnect} groupID={groupID} setGroupID={setGroupID} groups={groups} onChange={fetchGroups}/>
            <AddItemForm items={items} onSubmit={handleAddItem} onCancel={handleAddItem}/>
          </div>
          <div className="Tableau-et-boutons">
            <InventoryTable items={items} setItems={setItems} loading={loading} group={groupID}/>
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
      </CookiesProvider>
      
    </div>
    
  );
}

export default App;
