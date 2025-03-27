import React from "react";

function InventoryTable({ items, setItems, loading }) {

  const [shown_items, setShowItems] = React.useState(items.slice());
  
  const getItemCriticity = (item) => {
    if (item.quantity == 0) return "expired_or_none"; //Rouge foncé (car il n'y en a plus)
    if (item.bestBy != null) {
      const now = new Date();
      const bestBy = new Date(item.bestBy);
      const diffTime = bestBy - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
      if (diffDays < 0) return "expired_or_none"; // Rouge foncé (car périmé)
      if (diffDays <= 1) return "critical"; // Rouge (car 1 jour ou moins)
      if (diffDays <= 3) return "warning"; // Orange (car 3 jours ou moins)
      
    }
    return "";
  }

  const sortItems = (items) => {
    const priority = {
      expired_or_none: 0,
      critical: 1,
      warning: 2,
      "": 3 // pour les items normaux qui ne sont pas critiques encore
    };
  
    return [...items].sort((a, b) => {
      const aClass = getItemCriticity(a);
      const bClass = getItemCriticity(b);
      return priority[aClass] - priority[bClass];
    });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(items.map(item => 
      item._id === itemId ? { ...item, quantity: parseInt(newQuantity) } : item
    ));
    updateShownItems(null);
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item._id !== itemId));
    updateShownItems(null);
  };

  

  const updateShownItems = (update) => {
    const search_input = document.querySelector("#search-bar");
    if (search_input != null) {
      let value = search_input.value ?? "";
      let new_shown = items.filter(item => (item.name.toLowerCase()).includes(value.toLowerCase()));
      setShowItems(new_shown);
    } 
    else {
      setShowItems(items);
    }
    
  };

  const createDateString = (date_str) => {
    if (date_str == null) {
      return "N/A"
    }
    else {
      const date = new Date(date_str)
      /* volé de https://www.geeksforgeeks.org/how-to-format-javascript-date-as-yyyy-mm-dd/ */
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
      /* FIN volé de */
    }
  };

  const getShownItems = () => {

    const search_input = document.querySelector("#search-bar");
    if (search_input != null) {
      let value = search_input.value ?? "";
      let new_shown = items.filter(item => (item.name.toLowerCase()).includes(value.toLowerCase()));
      return new_shown
    }
    else {
      return items.slice()
    }
  };

  return (
    <div className="Tableau">
      <h2>Inventaire</h2>
      <div>
        <input className="Inventory-change-input" onChange={(e) => updateShownItems(e)} id="search-bar" placeholder="Barre de recherche"></input>
        <table className="fixed_header">
          
          <thead>
            <tr>
              <th className="Inventory-cell">Nom</th>
              <th className="Inventory-cell">Quantité</th>
              <th className="Inventory-cell">Date de péremption</th>
              <th className="Inventory-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="Tableau-inventaire">
            {sortItems(getShownItems()).map((item) => (
              <tr key={item._id} className={getItemCriticity(item)}>
                <td className="Inventory-cell">{item.name}</td>
                <td className="Inventory-cell">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    min="0"
                    className="Inventory-change-input"
                  />
                </td>
                <td className="Inventory-cell">
                  {createDateString(item.bestBy)}
                </td>
                <td className="Inventory-cell">
                  <button onClick={() => handleRemoveItem(item._id)} className="Bouton-tableau">
                    Enlever
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryTable;