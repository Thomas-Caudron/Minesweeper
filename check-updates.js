#!/usr/bin/env node

/**
 * Script de vérification et mise à jour automatique depuis GitHub
 * Usage: node check-updates.js
 * 
 * Options:
 * --auto : Met à jour automatiquement s'il y a des changements
 * --interval 3600 : Vérifie toutes les 3600 secondes (1h)
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const autoUpdate = args.includes('--auto');
const intervalArg = args.find(arg => arg.startsWith('--interval'));
const updateInterval = intervalArg ? parseInt(intervalArg.split(' ')[1]) * 1000 : null;

const REPO_URL = 'https://github.com/Thomas-Caudron/Minesweeper.git';
const MAIN_BRANCH = 'main';

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('fr-FR');
  const prefix = {
    info: '[ℹ️  INFO]',
    success: '[✅ SUCCESS]',
    warning: '[⚠️  WARNING]',
    error: '[❌ ERROR]'
  }[type] || '[INFO]';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function executeCommand(command, showOutput = false) {
  try {
    const result = execSync(command, { 
      encoding: 'utf-8',
      stdio: showOutput ? 'inherit' : 'pipe'
    });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function checkForUpdates() {
  log('Vérification des mises à jour...', 'info');
  
  // Vérifier que nous sommes dans un dépôt git
  const isGitRepo = executeCommand('git rev-parse --git-dir', false).success;
  if (!isGitRepo) {
    log('Erreur: Ce répertoire n\'est pas un dépôt Git', 'error');
    return false;
  }
  
  // Récupérer les derniers changements du serveur
  log('Récupération des changements distants...', 'info');
  const fetchResult = executeCommand('git fetch origin', false);
  if (!fetchResult.success) {
    log(`Impossible de récupérer les données: ${fetchResult.error}`, 'error');
    return false;
  }
  
  // Comparer HEAD avec origin/main
  const compareResult = executeCommand(
    `git rev-parse HEAD && git rev-parse origin/${MAIN_BRANCH}`,
    false
  );
  
  if (!compareResult.success) {
    log('Impossible de comparer les versions', 'error');
    return false;
  }
  
  const [localHash, remoteHash] = compareResult.output.split('\n');
  
  if (localHash === remoteHash) {
    log('Vous avez la dernière version', 'success');
    return false;
  }
  
  log('Une mise à jour est disponible!', 'warning');
  
  // Afficher les changements
  const logResult = executeCommand(
    `git log HEAD..origin/${MAIN_BRANCH} --oneline`,
    false
  );
  
  if (logResult.success && logResult.output) {
    console.log('\n📝 Changements disponibles:');
    console.log(logResult.output);
    console.log();
  }
  
  return true;
}

function performUpdate() {
  log('Démarrage de la mise à jour...', 'info');
  
  // Vérifier s'il y a des changements locaux non commités
  const statusResult = executeCommand('git status --porcelain', false);
  if (statusResult.success && statusResult.output) {
    log('Attention: Changements locaux détectés', 'warning');
    log('Stashing les changements locaux...', 'info');
    const stashResult = executeCommand('git stash', false);
    if (!stashResult.success) {
      log('Impossible de sauvegarder les changements locaux', 'error');
      return false;
    }
  }
  
  // Pull les changements
  log('Téléchargement de la mise à jour...', 'info');
  const pullResult = executeCommand(`git pull origin ${MAIN_BRANCH}`, true);
  
  if (!pullResult.success) {
    log(`Impossible de mettre à jour: ${pullResult.error}`, 'error');
    return false;
  }
  
  log('Mise à jour réussie!', 'success');
  return true;
}

function interactiveUpdate() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Voulez-vous mettre à jour? (o/n): ', (answer) => {
    rl.close();
    
    if (answer.toLowerCase() === 'o' || answer.toLowerCase() === 'oui') {
      if (performUpdate()) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    } else {
      log('Mise à jour annulée', 'warning');
      process.exit(0);
    }
  });
}

function run() {
  log('🚀 Vérificateur de mises à jour GitHub', 'info');
  log(`Dépôt: ${REPO_URL}`, 'info');
  
  if (checkForUpdates()) {
    if (autoUpdate) {
      performUpdate();
    } else {
      interactiveUpdate();
    }
  } else if (!updateInterval) {
    process.exit(0);
  }
}

if (updateInterval) {
  // Mode surveillance continue
  log(`Surveillance active - Vérification toutes les ${updateInterval / 1000}s`, 'info');
  
  setInterval(() => {
    if (checkForUpdates() && autoUpdate) {
      performUpdate();
    }
  }, updateInterval);
  
  // Première vérification immédiate
  run();
} else {
  run();
}
