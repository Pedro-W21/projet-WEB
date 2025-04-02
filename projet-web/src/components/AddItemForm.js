import React, { useState, useEffect } from "react";
/* début volé de https://www.geeksforgeeks.org/how-to-add-auto-complete-search-box-in-reactjs/ */
import Autosuggest from 'react-autosuggest';

const AutocompleteSearch = ({base_suggestions, setNewValue}) => {
  const [value, setValue] = useState('');
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

  const onChange = (event, { newValue }) => {
    setValue(newValue);
    setNewValue(newValue);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const inputProps = {
    placeholder: 'Type to search...',
    value,
    onChange
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
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme} // Apply custom theme for styling
      id="auto-search"
    />
  );
};

/* Fin volé de */

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
      group_id:groupID,
      _id:Date.now()
    });
  };

  const suggestions = items.map((item) => item.name);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

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

  const input = document.querySelector("#date-picker");
  const getNewDate = () => input?.value ?? "";

  //pour récupérer les données de la page barcode
  useEffect(() => {
    function handleMessage(event) {
        if (event.data && event.data.name) {
            setInputValue(event.data.name);
            setItem((prev) => ({
                ...prev,
                name: event.data.name // Remplit le champ automatiquement
            }));
        }
    }

    window.addEventListener("message", handleMessage);
    
    return () => {
        window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Fonction d'auto-complétion
  /*function AutoComplete({ items }) {
    const [suggestions, setSuggestions] = useState([]);

    // Fonction pour filtrer les suggestions
    const getShownItems = () => {
      const value = inputValue ?? "";
      return items.filter((i) =>
        i.name.toLowerCase().includes(value.toLowerCase())
      );
    };

    //met à jour les suggestions quand inputValue change
    useEffect(() => {
      setSuggestions(getShownItems());
    }, [inputValue]);

    //met à jour la valeur de inputValue en fonction de ce que l'utilisateur entre
    const handleInputChange = (e) => {
      setInputValue(e.target.value); // Saisie fluide sans toucher à l’état global
    };

    const handleSelectSuggestion = (name) => {
      setInputValue(name); //met à jour l'input visible
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
  }*/

  return (
    <div className="Ajoute-produit">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <AutocompleteSearch base_suggestions={suggestions} setNewValue={setInputValue}/>
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
        <button className="bouton-scan" onClick={handleCodeBarre}> {/* pour code barre */}
          Scanner par code-barre
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;
