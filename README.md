# API Gestion de Recettes

Une API complète pour gérer des recettes de cuisine. Créez, modifiez, supprimez et recherchez vos recettes.

## Fonctionnalités

- Créer de nouvelles recettes avec ingrédients
- Afficher toutes les recettes
- Voir les détails d'une recette
- Modifier une recette existante
- Supprimer une recette

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB avec Mongoose
- **Frontend** : HTML, CSS, JavaScript
- **Autres** : dotenv, cors

## Installation et lancement

### Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   
   Créer un fichier `.env` à la racine du projet :
   ```env
   PORT=3000
   URL_BDD=mongodb://localhost:27017/recettes
   ```
   
   > Pour MongoDB Atlas, remplacez par votre URL de connexion

4. **Démarrer MongoDB**
   
   Si vous utilisez MongoDB en local :
   ```bash
   mongod
   ```

5. **Lancer l'application**
   ```bash
   npm start
   # ou
   node server.js
   ```

6. **Accéder à l'application**
   
   Ouvrez votre navigateur et allez sur : `http://localhost:3000`
   
### Interface Web

1. **Créer une recette** : Remplissez le formulaire en haut de page
2. **Ajouter des ingrédients** : Cliquez sur "Ajouter un ingrédient" autant de fois que nécessaire
3. **Voir vos recettes** : La liste apparaît en bas de page
4. **Consulter une recette** : Cliquez sur le titre d'une recette
5. **Modifier/Supprimer** : Utilisez les boutons dans la popup de détail

Points d'amélioration: 
Ajouter des validations plus strictes pour les données.
Ajouter l'authentification des utilisateurs.
Gérer mieux les erreurs.

Contribuer: 
Si tu veux aider à améliorer l'API, ouvre une issue ou propose une pull request !
