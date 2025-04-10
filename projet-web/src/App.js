import image_logo_insa from './logo-ng.png'
import './App.css';


import React from 'react';
import axios from 'axios';
import InventoryTable, { genererListeCourses, formaterMessageCriticite } from './components/InventoryTable';
import AddItemForm from './components/AddItemForm';
import ConnectForm from './components/ConnectForm';
import { CookiesProvider, useCookies } from 'react-cookie';
import {useMediaQuery, MediaQuery} from 'react-responsive';


function App() {

  const isLandscape = useMediaQuery({ query: '(orientation: landscape)' })
  const [items, setItems] = React.useState([]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [showPopup, setShowPopup] = React.useState(false);
  const [recettes, setRecettes] = React.useState([]);

  /* Début vol de : https://clerk.com/blog/setting-and-using-cookies-in-react */
  const [cookies, setCookie] = useCookies(['user', 'window'])
  /* fin vol de */
  const [showListeCoursesPopup, setShowListeCoursesPopup] = React.useState(false);
  const [listeCoursesItems, setListeCoursesItems] = React.useState([]);
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
        const response = await axios.post(`http://${window.location.host}/api/group_inventories`, {group_id:right_group});
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

  if (cookies.user != undefined && cookies.user.group_id != "" && groupID == "" && cookies.window == undefined) {
    setGroupID(cookies.user.group_id);
    fetchInventory(cookies.user.group_id);
  }
  else if (cookies.user != undefined && cookies.user.group_id != "" && groupID == "" && cookies.window != undefined) {
    setGroupID(cookies.user.group_id);
    setItems(cookies.window.items);
  }

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://${window.location.host}/api/groups`);
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
        await axios.post(`http://${window.location.host}/api/inventory`, {group_id:groupID,items:real_items});
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
            await axios.post(`http://${window.location.host}/api/groups`, [...groups, {group_id:chosen_group}]);
            setGroups([...groups, {group_id:chosen_group}])
            setGroupID(chosen_group);
            const expirationDate = new Date()
            expirationDate.setDate(expirationDate.getDate() + 7)
            setCookie('user', {group_id:chosen_group}, { path: '/', expires:expirationDate})
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
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 7)
      setCookie('user', {group_id:chosen_group}, { path: '/', expires:expirationDate})
      setGroupID(chosen_group);
      alert("Connecté au groupe !");
      fetchInventory(chosen_group);
    }
    
  }

  const envoyerListeCourses = (itemsToSend) => {
    if (!itemsToSend || !itemsToSend.length) {
      alert("Votre liste de courses est vide !");
      return;
    }
  
    // Formatage du message
    const message = `Liste de Courses :\n` + 
    itemsToSend.map(item => `- ${item.nom} (${item.criticite})`).join("\n");
  
    const encodedMessage = encodeURIComponent(message);
  
    // Demande de choix entre WhatsApp et Email
    const choix = window.confirm("Voulez-vous envoyer la liste via WhatsApp ?");
  
    if (choix) {
      // ouvre WhatsApp Web, d'où on pourra choisir le destinataire
      window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, "_blank");
    }
  };  
  

  const handleRecettesClick = async () => {
    try {
        if (!groupID) {
            alert("Veuillez sélectionner un groupe !");
            return;
        }

        console.log(`Fetching recipes for group ID: ${groupID}`);

        const response = await axios.get(`http://${window.location.host}/api/inventory/recipes/${groupID}`);

        console.log('Response:', response.data);

        if (response.data.recettes) {
            setRecettes(response.data.recettes);
        } else if (response.data.message) {
            setRecettes([]);
            alert(response.data.message);
        } else {
            setRecettes([]);
        }

        setShowPopup(true);
    } catch (error) {
        console.error('Error fetching recipes:', error.response?.data || error);
        alert('Erreur lors de la récupération des recettes.');
    }
};

  const closePopup = () => {
    setShowPopup(false);
  };
  
  const handleListeCoursesClick = () => {
    const itemsListe = genererListeCourses(items);
    setListeCoursesItems(itemsListe);
    setShowListeCoursesPopup(true);
  };

  const handleRemoveFromList = (index) => {
    setListeCoursesItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const closeListeCoursesPopup = () => {
    setShowListeCoursesPopup(false);
  };

  const handleClickDetailRecette = async (index) => {
    const response = await axios.get(`http://${window.location.host}/api/inventory/recipes/${groupID}`);
    console.log("Données reçues :", response.data); 
    const lien = response.data.recettes[index].lienRecette;
    window.open(lien, "_blank");
  };

  return (
      <div className="App">
        <div>
          <h1>INSApprovisionnement</h1>
        </div>
        <div className = {isLandscape ? "Partie-fonctionnelle" : "Partie-fonctionnelle-vert"}>
          <div className={isLandscape ? "form-column" : "form-column-vert"}>
            <ConnectForm onSubmit={handleGroupConnect} onCancel={handleGroupConnect} groupID={groupID} setGroupID={setGroupID} groups={groups} onChange={fetchGroups}/>
            <AddItemForm items={items} onSubmit={handleAddItem} onCancel={handleAddItem} setCookies={setCookie}/>
          </div>
          <div className={isLandscape ? "Tableau-et-boutons" : "Tableau-et-boutons-vert"}>
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
              <button className="Bouton-tableau" onClick={handleListeCoursesClick}>
                Générer une liste de courses
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
              {recettes.length > 0 ? (
                <ul>
                  {recettes.map((recette, index) => (
                  <li 
                  key={index}
                  onClick={() => handleClickDetailRecette(index)} // Ajoute l'action au clic
                  style={{ cursor: 'pointer' }} // Change le curseur en main pointant pour indiquer que c'est cliquable
                >
                  {recette.nom}
                </li>                  
                ))}
              </ul>
              ) : (
                <p>Aucune recette disponible avec les ingrédients actuels.</p>
              )}
              <button onClick={closePopup}>Fermer</button>
            </div>
          </div>
        </>
      )}
       {showListeCoursesPopup && (
        <>
          <div className="popup-overlay" onClick={closeListeCoursesPopup}></div>
          <div className="popup">
            <div className="popup-content">
              <h2>Liste de Courses</h2>
              <ul>
                {listeCoursesItems.map((item, index) => (
                  <li key={index}>{item.nom} ({item.criticite})
                    <button 
                      onClick={() => handleRemoveFromList(index)}
                      className="remove-button">
                      Enlever de la liste
                    </button>
                  </li>
                ))}
              </ul>
              <div className="popup-buttons">
                <button onClick={() => envoyerListeCourses(listeCoursesItems)}>
                  Envoyer par WhatsApp
                </button>
                <button onClick={closeListeCoursesPopup}>Fermer</button>
              </div>
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
