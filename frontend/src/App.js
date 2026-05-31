// ============================================================
// APPLICATION REACT - FRONT-END CRUD
// Interface de gestion des utilisateurs
// ============================================================

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ============================================================
  // ÉTAT (State)
  // ============================================================

  // Liste de tous les utilisateurs
  const [utilisateurs, setUtilisateurs] = useState([]);

  // État du formulaire pour ajouter/modifier
  const [formulaire, setFormulaire] = useState({
    id: null,
    nom: '',
    email: '',
    role: ''
  });

  // Indicateur pour savoir si on est en mode modification
  const [enModification, setEnModification] = useState(false);

  // Message d'erreur ou de succès
  const [message, setMessage] = useState('');

  // ============================================================
  // FONCTION: Charger tous les utilisateurs depuis le back-end
  // ============================================================

  const chargerUtilisateurs = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const result = await response.json();

      if (result.success) {
        setUtilisateurs(result.data);
        console.log('✓ Utilisateurs chargés:', result.data);
      }
    } catch (error) {
      console.error('✗ Erreur lors du chargement:', error);
      afficherMessage('Erreur de connexion avec le serveur', 'error');
    }
  };

  // ============================================================
  // EFFET (useEffect) - Charger les utilisateurs au démarrage
  // ============================================================

  useEffect(() => {
    chargerUtilisateurs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Vide [] = s'exécute une seule fois au démarrage

  // ============================================================
  // FONCTION: Gérer les changements dans le formulaire
  // ============================================================

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormulaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ============================================================
  // FONCTION: Soumettre le formulaire (Ajouter ou Modifier)
  // ============================================================

  const soumettreFormulaire = async (e) => {
    e.preventDefault();

    // Validation basique
    if (!formulaire.nom.trim() || !formulaire.email.trim() || !formulaire.role) {
      afficherMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    try {
      let response;
      let donnees = {
        nom: formulaire.nom,
        email: formulaire.email,
        role: formulaire.role
      };

      if (enModification) {
        // Mode MODIFICATION (PUT)
        response = await fetch(`http://localhost:5000/users/${formulaire.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donnees)
        });
      } else {
        // Mode CRÉATION (POST)
        response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donnees)
        });
      }

      const result = await response.json();

      if (result.success) {
        afficherMessage(result.message, 'success');
        reinitialiserFormulaire();
        chargerUtilisateurs();
      } else {
        afficherMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('✗ Erreur:', error);
      afficherMessage('Erreur lors de l\'envoi des données', 'error');
    }
  };

  // ============================================================
  // FONCTION: Charger un utilisateur pour modification
  // ============================================================

  const modifierUtilisateur = (utilisateur) => {
    setFormulaire({
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role
    });
    setEnModification(true);
  };

  // ============================================================
  // FONCTION: Supprimer un utilisateur
  // ============================================================

  const supprimerUtilisateur = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        afficherMessage(result.message, 'success');
        chargerUtilisateurs();
      } else {
        afficherMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('✗ Erreur:', error);
      afficherMessage('Erreur lors de la suppression', 'error');
    }
  };

  // ============================================================
  // FONCTION: Réinitialiser le formulaire
  // ============================================================

  const reinitialiserFormulaire = () => {
    setFormulaire({
      id: null,
      nom: '',
      email: '',
      role: ''
    });
    setEnModification(false);
  };

  // ============================================================
  // FONCTION: Afficher un message temporaire
  // ============================================================

  const afficherMessage = (texte, type) => {
    setMessage({ texte, type });
    setTimeout(() => setMessage(''), 4000);
  };

  // ============================================================
  // RENDER (Affichage de l'interface)
  // ============================================================

  return (
    <div className="container">
      {/* En-tête */}
      <header className="header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <p>Application CRUD complète avec React et Express.js</p>
      </header>

      {/* Messages */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.texte}
        </div>
      )}

      <div className="content">
        {/* FORMULAIRE */}
        <section className="formulaire-section">
          <h2>{enModification ? '✏️ Modifier un utilisateur' : '➕ Ajouter un nouvel utilisateur'}</h2>
          <form onSubmit={soumettreFormulaire} className="formulaire">
            <div className="groupe-champ">
              <label htmlFor="nom">Nom:</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formulaire.nom}
                onChange={gererChangement}
                placeholder="Entrez le nom complet"
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formulaire.email}
                onChange={gererChangement}
                placeholder="Entrez l'adresse email"
              />
            </div>

            <div className="groupe-champ">
              <label htmlFor="role">Rôle:</label>
              <select
                id="role"
                name="role"
                value={formulaire.role}
                onChange={gererChangement}
              >
                <option value="">-- Sélectionner un rôle --</option>
                <option value="Admin">Admin</option>
                <option value="Utilisateur">Utilisateur</option>
                <option value="Modérateur">Modérateur</option>
              </select>
            </div>

            <div className="boutons-formulaire">
              <button type="submit" className="btn btn-primary">
                {enModification ? 'Mettre à jour' : 'Créer'}
              </button>
              {enModification && (
                <button type="button" onClick={reinitialiserFormulaire} className="btn btn-secondary">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* TABLEAU DES UTILISATEURS */}
        <section className="utilisateurs-section">
          <h2>📋 Liste des utilisateurs</h2>
          {utilisateurs.length === 0 ? (
            <p className="vide">Aucun utilisateur trouvé</p>
          ) : (
            <table className="tableau">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(utilisateur => (
                  <tr key={utilisateur.id}>
                    <td>{utilisateur.id}</td>
                    <td>{utilisateur.nom}</td>
                    <td>{utilisateur.email}</td>
                    <td>
                      <span className={`badge badge-${utilisateur.role.toLowerCase()}`}>
                        {utilisateur.role}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => modifierUtilisateur(utilisateur)}
                        className="btn btn-modifier"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => supprimerUtilisateur(utilisateur.id)}
                        className="btn btn-supprimer"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
