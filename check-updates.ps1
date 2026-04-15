# Script de vérification et mise à jour GitHub pour Windows PowerShell
# Usage: .\check-updates.ps1
# Usage avec auto-update: .\check-updates.ps1 -AutoUpdate
# Usage avec surveillance: .\check-updates.ps1 -Interval 3600 -AutoUpdate

param(
    [switch]$AutoUpdate,
    [int]$Interval = 0
)

$REPO_URL = "https://github.com/Thomas-Caudron/Minesweeper.git"
$MAIN_BRANCH = "main"

function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $prefix = switch($Type) {
        "Success"   { "✅ SUCCESS" }
        "Warning"   { "⚠️  WARNING" }
        "Error"     { "❌ ERROR" }
        default     { "ℹ️  INFO" }
    }
    
    Write-Host "[$prefix] [$timestamp] $Message" -ForegroundColor $(
        switch($Type) {
            "Success"   { "Green" }
            "Warning"   { "Yellow" }
            "Error"     { "Red" }
            default     { "Cyan" }
        }
    )
}

function Test-GitRepo {
    try {
        $null = git rev-parse --git-dir 2>$null
        return $true
    }
    catch {
        return $false
    }
}

function Check-Updates {
    Write-Log "Vérification des mises à jour..." "Info"
    
    if (-not (Test-GitRepo)) {
        Write-Log "Erreur: Ce répertoire n'est pas un dépôt Git" "Error"
        return $false
    }
    
    # Récupérer les derniers changements
    Write-Log "Récupération des changements distants..." "Info"
    try {
        git fetch origin 2>&1 | Out-Null
    }
    catch {
        Write-Log "Impossible de récupérer les données: $_" "Error"
        return $false
    }
    
    # Comparer les versions
    try {
        $localHash = git rev-parse HEAD 2>&1
        $remoteHash = git rev-parse "origin/$MAIN_BRANCH" 2>&1
    }
    catch {
        Write-Log "Impossible de comparer les versions" "Error"
        return $false
    }
    
    if ($localHash -eq $remoteHash) {
        Write-Log "Vous avez la dernière version" "Success"
        return $false
    }
    
    Write-Log "Une mise à jour est disponible!" "Warning"
    
    # Afficher les changements
    $changes = git log "HEAD..origin/$MAIN_BRANCH" --oneline 2>&1
    if ($changes) {
        Write-Host "`n📝 Changements disponibles:" -ForegroundColor Cyan
        Write-Host $changes
        Write-Host ""
    }
    
    return $true
}

function Start-Update {
    Write-Log "Démarrage de la mise à jour..." "Info"
    
    # Vérifier les changements locaux
    $status = git status --porcelain 2>&1
    if ($status) {
        Write-Log "Attention: Changements locaux détectés" "Warning"
        Write-Log "Stashing les changements locaux..." "Info"
        try {
            git stash 2>&1 | Out-Null
        }
        catch {
            Write-Log "Impossible de sauvegarder les changements locaux" "Error"
            return $false
        }
    }
    
    # Mettre à jour
    Write-Log "Téléchargement de la mise à jour..." "Info"
    try {
        git pull origin $MAIN_BRANCH 2>&1
        Write-Log "Mise à jour réussie!" "Success"
        return $true
    }
    catch {
        Write-Log "Impossible de mettre à jour: $_" "Error"
        return $false
    }
}

function Invoke-InteractiveUpdate {
    $choice = Read-Host "Voulez-vous mettre à jour? (o/n)"
    
    if ($choice -eq "o" -or $choice -eq "oui") {
        $null = Start-Update
    }
    else {
        Write-Log "Mise à jour annulée" "Warning"
    }
}

function main {
    Write-Host "`n🚀 Vérificateur de mises à jour GitHub`n" -ForegroundColor Magenta
    Write-Log "Dépôt: $REPO_URL" "Info"
    
    $updateAvailable = Check-Updates
    
    if ($updateAvailable) {
        if ($AutoUpdate) {
            $null = Start-Update
        }
        else {
            Invoke-InteractiveUpdate
        }
    }
}

if ($Interval -gt 0) {
    Write-Log "Surveillance active - Vérification toutes les $Interval secondes" "Info"
    
    while ($true) {
        main
        Write-Host ""
        Start-Sleep -Seconds $Interval
    }
}
else {
    main
}
