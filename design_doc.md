# Insapprovisionnement

- gestionnaire d'inventaire pour une turne/colloc
- architecture MERN : MongoDB Express React Node

## Concept global

- 1 serveur avec une base de données contenant l'inventaire de la colloc
    - un item en inventaire c'est :
        - un nom (pas nécessairement unique, faudra utiliser un UUID en backend)
        - une quantité (>0)
        - une date de péremption (optionnelle, par ex les fournitures scolaires ont pas besoin de date de péremption)
    - la base de donnée ne contient que ça dans le concept de base, pas d'authentification (on suppose qu'on a 1 serveur par colloc, potentiellement protégé par un VPN pour y accéder depuis l'extérieur)
- 1 site web permettant d'intéragir avec la base de données
    - on voit tout l'inventaire et on peut récupérer son état le plus récent à tout instant
    - les produits sur le point de périmer/ dont on va tomber à court sont mis en évidence
    - on peut changer les quantités de tous les produits en inventaire
    - on peut rajouter des produits à volonté
    - on peut enlever des produits de l'inventaire au besoin (enlever != réduire la quantité à 0)
    - une fois que l'utilisateur a fini de mettre à jour sa version locale de l'inventaire, iel peut l'upload en 1 click (opération d'écriture sur la base de donnée réelle)

## Extensions possibles

- génération de liste de courses téléchargeable automatique
- système de comptes liés à des collocs particulières (difficile et faut bien gérer la partie sécurité)
- le site s'adapte à la fréquence à laquelle on consomme les produits en inventaire
- possibilité de lier une BDD de recettes pour savoir ce qu'on peut faire avec les produits en inventaire (ou ce qu'il manque pour faire une recette donnée !)



## Point 26/03
ce qu'il reste à faire :
- script de lancement/fin fini pour windows
- Génération de recette (Sofia y est déjà)
- barre de recherche rapide dans la BDD
- génération de liste de courses
- améliorer le rendu de la frontend (avoir tout qui s'aligne bien + couleurs différentes pour différents niveaux de criticité des produits + produits critiques en premier)