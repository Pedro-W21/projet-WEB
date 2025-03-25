import React from 'react';

function AddItemForm({ onSubmit, onCancel }) {
  const [item, setItem] = React.useState({
    name: '',
    quantity: 1,
    bestBy: null,
    _id:Date.now()
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
        {
          name:item.name,
          quantity:item.quantity,
          bestBy:item.bestBy,
          _id:Date.now()
        }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value === 'quantity' ? parseInt(value) : value,
    }));
  };
  const input = document.querySelector("#date-picker");
  const getNewDate = () => {
    
    return input.value
  };

  return (
    <div className="Ajoute-produit">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input
            className="Inventory-input"
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
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
            selected={item.bestBy}
            onChange={(date) => setItem(prev => ({ ...prev, bestBy: getNewDate() }))}
          />
        </div>
          <button type="submit" onClick={handleSubmit} className="Inventory-input-button">Entrer</button>
      </form>
    </div>
  );
}

export default AddItemForm;