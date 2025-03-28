import React, { useState, useEffect } from "react";

function AddItemForm({ items, onSubmit, onCancel }) {
  const [item, setItem] = useState({
    name: "",
    quantity: 1,
    bestBy: null,
    _id: Date.now(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: item.name,
      quantity: item.quantity,
      bestBy: item.bestBy,
      _id: Date.now(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const input = document.querySelector("#date-picker");
  const getNewDate = () => input?.value ?? "";

  //fonction auto-complétion
  function AutoComplete({ items }) {
    const [suggestions, setSuggestions] = useState([]); //suggestions filtrées
    const [inputValue, setInputValue] = useState(""); //stockage temporaire saisie utilisateur

    //fonction pour récupérer items filtrés
    const getShownItems = () => {
      let value = inputValue ?? ""; //récupère l'entrée utilisateur
      let filteredItems = items.filter((i) =>
        i.name.toLowerCase().includes(value.toLowerCase()) //recherche dans bd
      );
      return filteredItems; //retourne un tableau filtré
    };

    // maj les suggestions en fonction de la saisie utilisateur
    useEffect(() => {
      setSuggestions(getShownItems());
    }, [inputValue]); // déclenchement sur inputValue

    //maj suggestions et inputvalue
    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value); // Met à jour l'input temporaire
    };

    const handleSelectSuggestion = (name) => {
      setInputValue(name); // Met à jour la saisie visible
      setItem((prev) => ({ ...prev, name })); // Met à jour l'état global avec la suggestion choisie
      setSuggestions([]); // Efface les suggestions après la sélection
    };

    return (
      <div className="autocompletion">
        <input
          className="Inventory-input"
          type="text"
          name="name"
          value={inputValue} // Lier l'input à inputValue
          onChange={handleInputChange} // Mettre à jour seulement inputValue
          placeholder="Tapez pour rechercher..."
          required
        />

        {/* Affichage dynamique des suggestions */}
        {inputValue && suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion.name)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="Ajoute-produit">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          {/* Utilisation du composant AutoComplete */}
          <AutoComplete items={items} />
        </div>
        <div>
          <label>Quantité:</label>
          <input
            className="Inventory-input"
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div>
          <label>Date de péremption:</label>
          <input
            className="Inventory-input"
            type="date"
            id="date-picker"
            selected={item.bestBy}
            onChange={(e) => setItem((prev) => ({ ...prev, bestBy: getNewDate() }))}
          />
        </div>
        <button type="submit" className="Inventory-input-button">
          Entrer
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;
