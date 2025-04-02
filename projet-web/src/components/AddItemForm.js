import React, { useState, useEffect } from "react";
/* début volé de https://www.geeksforgeeks.org/how-to-add-auto-complete-search-box-in-reactjs/ */
import Autosuggest from 'react-autosuggest';

//partie auto-complétion
const AutocompleteSearch = ({ base_suggestions, value, onChange }) => {
  const [suggestions, setSuggestions] = useState(base_suggestions);

  const getSuggestions = (inputValue) => {
    const regex = new RegExp(inputValue.trim(), 'i');
    return base_suggestions.filter((language) => regex.test(language));
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Type to search...',
    value,
    onChange: (event, { newValue }) => onChange(newValue), // Appel direct à onChange
  };

  // Custom theme for styling
  const theme = {
    container: 'autocomplete-container',
    suggestionsContainer: 'autocomplete-suggestions',
    suggestion: 'autocomplete-suggestion',
    input: 'autocomplete-input'
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
      inputProps={inputProps}
      theme={theme} // Apply custom theme for styling
      id="auto-search"
    />
  );
};

function AddItemForm({ items, onSubmit, onCancel, groupID }) {
  const [item, setItem] = useState({
    name: "",
    quantity: 1,
    bestBy: null,
    group_id: groupID,
    _id: Date.now(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item,
      group_id: groupID,
      _id: Date.now(),
    });
  };

  const suggestions = Array.from(new Set(items.map((item) => item.name)));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  //partie code barre
  const handleCodeBarre = () => {
    const popup = window.open(
      "/barcode_reader2.html",
      "PopupScanner",
      "width=500,height=600,top=100,left=100"
    );

    if (!popup) {
      alert("Veuillez autoriser les popups pour utiliser le scanner.");
    }
  };

  //remplit automatiquement le input
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.name) {
        setItem((prev) => ({
          ...prev,
          name: event.data.name, // Mise à jour sans conflit avec l'auto-complete
        }));
        // à enlever si on veut pas que ça rajoute automatiquement
        /*
        onSubmit({
          ...item,
          name: event.data.name,
          group_id: groupID,
          _id: Date.now(),
        });*/
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="Ajoute-produit">
      <h2>Ajouter un produit</h2>
      <form>
        <div>
          <label>Nom:</label>
          <AutocompleteSearch
            base_suggestions={suggestions}
            value={item.name} // Utilise item.name comme source unique
            onChange={(newValue) => setItem((prev) => ({ ...prev, name: newValue }))}
          />
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
            onChange={(e) =>
              setItem((prev) => ({ ...prev, bestBy: e.target.value }))
            }
          />
        </div>
        <div>
        <button type="submit" className="Inventory-input-button" onClick={handleSubmit}>
          Entrer
        </button>
        </div>
        
        <div className="ou">
          <span>
            ou
          </span>
        </div>
        <div>
        <button className="bouton-scan" onClick={handleCodeBarre}> {/* pour code barre */}
          Scanner par code-barre
        </button>
        </div>
      </form>
    </div>
  );
}


export default AddItemForm;
