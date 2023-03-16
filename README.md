# DevMob DUMOULIN DULUYE

Projet de DevMob de **Antony DULUYE** et **DUMOULIN Margot**.

## Fonctionnalités

-   Page Liste des Pokémons
    -   Affichage tuile / liste
    -   Distinction pokémons customisés/vrai pokémons (Badge "NEW")
    -   Import pokémons créés
    -   Export pokémons créés
        -   Le fichier est enregistrée dans le dossier `/DCIM` sur Android
        -   Le fichier est nommé `export.json`
        -   Si `export.json` existe déjà, les fichiers seront nommés `export_0.json`, `export_1.json`, etc...
        -   Un fichier exemple est présent sur le Drive [ici](https://drive.google.com/drive/folders/1dAkZBhqewJ2kGH2dxPdguauIWGdi91Zg?usp=sharing)
        -   Les images sont converties en base64 et compressées afin d'être exportées
    -   Recherche par nom
        -   Filtrer par nouveaux pokémons, pokémons originaux, pokémons favoris
    -   Au clic sur un pokémon > Vue detaillee des infos d’un pokémon
        -   Distinction pokémons customisés/vrais pokémons (Badge "NEW")
        -   Mise en favoris d'un pokémon
        -   Retirer un pokémon des favoris
        -   Suppression d'un pokémon (si c'est un pokémon customisé)
        -   Modification d'un pokémon (si c'est un pokémon customisé)
        -   Possibilité d'accéder à la position de sa région sur la carte à l'aide d'un bouton
-   Page Carte
    -   Géolocalisation des différentes régions
-   Page Création des Pokémons
    -   Permet l'ajout/la modification de pokémons customisés.
    -   Ajout d'image par caméra

## Démonstration

Vous pourrez trouver des démos du projet sur le drive suivant : [ici](https://drive.google.com/drive/folders/1dAkZBhqewJ2kGH2dxPdguauIWGdi91Zg?usp=sharing)

![Demo 1](https://i.imgur.com/snHtVu1.png)
![Demo 2](https://i.imgur.com/BR885F6.png)
![Demo 3](https://i.imgur.com/J36weGa.png)

Les vidéos de démonstration peuvent montrer, pour certaines, d'anciennes versions de l'application ; des effets mineurs d'amélioration de l'interface ont été appliqués depuis (légères modifications de la page Pokemon pour aligner les statistiques, indications des unités dans le formulaire de création/modification...).

## Disclaimer :warning:

La recherche des pokémons, au lancement de l'application, prend du temps et nous en sommes conscients.
La sélection de région également, elle utilise un composant externe qui supporte mal les listes de grande volume (850~).

Si nous n'avions pas été pris par le temps, nous aurions amélioré en priorité ces deux fonctionnalités.
