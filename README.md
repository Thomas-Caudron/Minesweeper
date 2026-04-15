# 🚩 Démineur

Un jeu de Démineur moderne, responsive et jouable sur desktop et mobile.

## 🎮 Caractéristiques

- **3 niveaux de difficulté** : Facile (9x9, 10 mines), Moyen (16x16, 40 mines), Difficile (30x16, 99 mines)
- **Responsive Design** : Interface adaptée automatiquement aux écrans de téléphone et tablette
- **Chronomètre** : Compteur de temps intégré
- **Compteur de mines** : Suivi du nombre de mines restantes
- **Mode Plein Écran** : Expérience immersive
- **Design moderne** : Interface élégante avec gradients et animations

## 🕹️ Comment Jouer

1. **Clic gauche** : Révéler une cellule
2. **Clic droit** : Placer/retirer un drapeau
3. **Première révélation** : Les mines sont placées après votre premier clic (garantissant une victoire possible)

### Objectif

Révélez toutes les cellules sans mines. Les chiffres indiquent combien de mines se trouvent à proximité.

## 🌐 Accès Rapide

Ouvrez simplement `index.html` dans votre navigateur pour jouer !

```bash
# Ou servez le fichier localement avec un serveur web
python -m http.server 8000
# Puis visitez http://localhost:8000
```

## 📱 Compatibilité

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablette (iPad, Android)
- ✅ Mobile (Téléphone iOS et Android)

## 🚀 Installation

1. Clonez le dépôt
```bash
git clone https://github.com/Thomas-Caudron/Minesweeper.git
cd Minesweeper
```

2. Ouvrez `index.html` dans votre navigateur

## 🔄 Mise à Jour Automatique

Le projet inclut des outils pour vérifier et télécharger automatiquement les mises à jour.

### Avec PowerShell (Windows recommandé)

**Vérification avec demande de confirmation:**
```powershell
.\check-updates.ps1
```

**Mise à jour automatique:**
```powershell
.\check-updates.ps1 -AutoUpdate
```

**Surveillance continue (vérifie toutes les heures):**
```powershell
.\check-updates.ps1 -Interval 3600 -AutoUpdate
```

### Avec Node.js (Multi-plateforme)

**Vérification avec demande de confirmation:**
```bash
node check-updates.js
```

**Mise à jour automatique:**
```bash
node check-updates.js --auto
```

**Surveillance continue (vérifie toutes les heures):**
```bash
node check-updates.js --auto --interval 3600
```

## 💻 Architecture

- `index.html` - Page principale avec HTML, CSS et JavaScript
- Structure simple et autonome, aucune dépendance externe

## 🎨 Personnalisation

Vous pouvez facilement modifier :
- Les couleurs dans la section `<style>`
- Les niveaux de difficulté dans l'objet `DIFFICULTIES`
- Les tailles de cellules via `getOptimalCellSize()`

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue !

---

**Amusez-vous bien et bonne chance! 🍀**
