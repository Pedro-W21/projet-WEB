import React, { useState, useEffect } from "react";

function AddItemForm({ items, onSubmit, onCancel, groupID }) {
  const [item, setItem] = useState({
    name: "",
    quantity: 1,
    bestBy: null,
    group_id: groupID,
    _id: Date.now(),
  });

  const [inputValue, setInputValue] = useState(item.name); // Pour l'auto-complétion

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item, // Récupère tout l'état item
      name: inputValue, // Utilise inputValue comme valeur finale de item.name
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

  // Fonction d'auto-complétion
  function AutoComplete({ items }) {
    const [suggestions, setSuggestions] = useState([]);

    // Fonction pour filtrer les suggestions
    const getShownItems = () => {
      const value = inputValue ?? "";
      return items.filter((i) =>
        i.name.toLowerCase().includes(value.toLowerCase())
      );
    };

    useEffect(() => {
      setSuggestions(getShownItems());
    }, [inputValue]);

    const handleInputChange = (e) => {
      setInputValue(e.target.value); // Saisie fluide sans toucher à l’état global
    };

    const handleSelectSuggestion = (name) => {
      setInputValue(name); // Met à jour l'input visible
      setItem((prev) => ({ ...prev, name })); // Met aussi à jour l'état global principal
      setSuggestions([]); // Efface les suggestions après sélection
    };

    return (
      <div className="autocompletion">
        <input
          className="Inventory-input"
          type="text"
          name="name"
          value={inputValue} // inputValue permet la saisie fluide
          onChange={handleInputChange}
          placeholder="Tapez pour rechercher..."
          required
        />

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
            onChange={(e) =>
              setItem((prev) => ({ ...prev, bestBy: getNewDate() }))
            }
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
