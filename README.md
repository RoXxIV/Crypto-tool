# Crypto-Tool

Ce projet est un outil d'analyse technique pour les cryptomonnaies, qui utilise l'API Binance pour récupérer les données et effectuer divers calculs, tels que les niveaux de support et de résistance, les points pivots, et les statistiques sur 24 heures.

## Fonctionnalités

- Récupération des données de prix en temps réel et historiques à partir de l'API Binance
- Calcul des niveaux de support et de résistance en utilisant les retracements de Fibonacci
- Calcul des points pivots
- Affichage des statistiques sur 24 heures (variation de prix, pourcentage de variation, prix haut et bas)

## Calculs

### Niveaux de support et de résistance

Les niveaux de support et de résistance sont calculés en utilisant les retracements de Fibonacci. Les prix hauts et bas de chaque bougie sont utilisés pour déterminer les niveaux de Fibonacci, qui sont ensuite filtrés pour obtenir les niveaux de support et de résistance.

### Points pivots

Les points pivots sont calculés en utilisant la formule suivante :

- Point pivot (PP) = (Prix haut + Prix bas + Prix de clôture) / 3
- R1 = 2 \* PP - Prix bas
- R2 = PP + (Prix haut - Prix bas
- R3 = Prix haut + 2 \* (PP - Prix bas)
- S1 = 2 \* PP - Prix haut
- S2 = PP - (Prix haut - Prix bas)
- S3 = Prix bas - 2 \* (Prix haut - PP)

### Retracements de Fibonacci

Les retracements de Fibonacci sont un outil populaire utilisé en analyse technique pour identifier des niveaux clés de support et de résistance. Ils sont basés sur la séquence de Fibonacci, une suite de nombres découverte par le mathématicien italien Leonardo Fibonacci au 13ème siècle. La séquence commence par 0, 1 et chaque nombre suivant est la somme des deux précédents (0, 1, 1, 2, 3, 5, 8, 13...).

Les retracements de Fibonacci sont obtenus en traçant des lignes horizontales entre le point haut et le point bas d'une période donnée, puis en divisant la distance verticale par les ratios clés de la séquence de Fibonacci. Les ratios les plus couramment utilisés sont 23,6 %, 38,2 %, 50 %, 61,8 % et 78,6 %. Dans notre projet, nous utilisons les niveaux suivants : 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.

Voici comment calculer les niveaux de Fibonacci pour les supports et les résistances :

- Trouver le prix le plus bas (minPrice) et le prix le plus haut (maxPrice) dans l'ensemble des données.
- Calculer la différence entre le prix le plus haut et le prix le plus bas (maxPrice - - Multiplier cette différence par chaque ratio de Fibonacci pour obtenir les niveaux de retracement.
- Ajouter chaque niveau de retracement au prix le plus bas pour obtenir les niveaux de prix associés.

### Statistiques sur 24 heures

Les statistiques sur 24 heures incluent la variation de prix, le pourcentage de variation, le prix le plus élevé et le prix le plus bas sur une période de 24 heures. Ces données sont récupérées directement à partir de l'API Binance.
