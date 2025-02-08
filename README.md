# Description
Ce répo représente le back de l'application "Tournoi wow". Le but de l'application est d'organiser des tournois wows.\
Vous pouvez retrouvez le répo du frontend [ici](https://github.com/pierrebraem/tournoi_wow_front).

# Installation
## Télécharger Docker
Pour pouvoir faire l'installation du back, vous devez avoir Docker installer sur votre ordinateur.\
Vous pouvez le télécharger [à cette adresse](https://www.docker.com/).

## Cloner le projet
Une fois fait, clonez le projet :
```
git clone https://github.com/pierrebraem/tournoi_wow_back.git
```

## Créer un fichier .env
Afin de faire fonctionner le projet, vous devez avoir un fichier `.env` à la racine du projet.\
Vous pouvez soit renommez le fichier `.env.example` en `.env` ou créez un fichier `.env` en prenant comme modèle le fichier `.env.example`.

## Création des containers
Une fois Docker installé et le fichier `.env` créé, on peut créer nos containers.\
Trois containers seront créés :
- Un pour l'API
- Un pour Postgres
- Un pour pgadmin
  
Pour lancer la création des containers, ouvrez un terminal à la racine du projet et tapez la commande suivante :
```
docker compose up -d
```
L'opération peu prendre un certains temps.

## Initialisation de la BDD
Une fois les containers créés, ouvrez un navigateur et tapez l'adresse `http://localhost:5050`. Si vous avez une erreur, il est possible que le container `pgadmin` n'a pas encore démarré. Si c'est le cas, patientez une dizaines de secondes.

Vous allez tomber sur une page de connexion. Entrez les identifiants que vous avez saisis dans les variables `PGADMIN_EMAIL` et `PGADMIN_PASSWORD` du fichier `.env`.

Ensuite, connectez postgres à pgadmin en fessant clique droit sur `Serveurs` puis `Register` et `Server...`.

![image](https://github.com/user-attachments/assets/ff6d7df6-6e13-4dfb-b825-8aed28e4ccd6)

Pour poursuivre, dans `name`, vous pouvez saisisir ce que vous voulez.\
Ensuite, dans l'onglet `Connection` :
- Tapez dans `Host name/address` `postgresdb`
- Tapez dans `Port` `5432`
- Tapez dans `Username` la valeur de la variable `DB_USERNAME` dans le fichier `.env`
- Tapez dans `Password` la valeur de la variable `BD_PASSWORD` dans le fichier `.env`

![image](https://github.com/user-attachments/assets/0bec85af-25ef-4758-bf68-1a620910c80e)

Pour continuer, sur le côté droit, vous verrez la connection à postgres.\
Déroulez le et `Databases` et selectionnez la bdd `tournoi`.\
En haut à gauche, cliquez sur l'icone de bdd avec une flèche de lecture.

![image](https://github.com/user-attachments/assets/25f9b0fb-fdd0-4bda-94b2-1d9c8fac1f0c)

Une fois fait, exécutez les requêtes SQL nécessaires et appuyez sur ![image](https://github.com/user-attachments/assets/652c6ad2-904e-43c7-a245-36cea89af90c)
