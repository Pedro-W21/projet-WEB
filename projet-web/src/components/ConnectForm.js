import React from 'react';

function ConnectForm({ onSubmit, onCancel, groupID, setGroupID, groups, onChange }) {

  const handleCreate = (e) => {
    const group_input = document.querySelector("#group-input");
    e.preventDefault();
    onSubmit(
        group_input.value,
        true
    );
  };
  const handleConnection = (e) => {
    const group_input = document.querySelector("#group-input");
    e.preventDefault();
    onSubmit(
        group_input.value,
        false
    );
  };

  const handleChange = (e) => {
    onChange()
  };

  return (
    <div className="choix-groupe">
      <h2>Choix de groupe</h2>
      <form onSubmit={(e) => {}}>
        <div>
          <label>Nom:</label>
          <input
            className="Inventory-input"
            type="text"
            name="name"
            placeholder="nom de groupe"
            onChange={handleChange}
            required
            id="group-input"
          />
        </div>
        <button type="submit" onClick={handleCreate} className="Inventory-input-button">Créer</button>

        <button type="submit" onClick={handleConnection} className="Inventory-input-button">Se connecter</button>
      </form>
    </div>
  );
}

export default ConnectForm;