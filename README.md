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
Deux containers seront créés :
- Un pour l'API
- Un pour Postgres
  
Pour lancer la création des containers, ouvrez un terminal à la racine du projet et tapez la commande suivante :
```
docker compose up -d
```
L'opération peu prendre un certains temps.

Si tous s'est bien passé, les containeurs devraient être opérationnels.
