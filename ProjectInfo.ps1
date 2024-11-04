function Get-ProjectStructure {
    param (
        [string]$path = ".",
        [string]$indent = "",
        [string[]]$exclude = @("node_modules", "bin", "obj", ".git", ".vs", "packages", "dist", "build"),
        [System.Collections.ArrayList]$processedPaths = [System.Collections.ArrayList]::new()
    )

    # Create output array for this level
    $output = [System.Collections.ArrayList]::new()
    
    # Get items and sort them
    $items = Get-ChildItem -Path $path -Force -ErrorAction SilentlyContinue | 
             Sort-Object { $_.PSIsContainer }, Name |
             Where-Object { $exclude -notcontains $_.Name }
    
    $itemCount = $items.Count
    
    for ($i = 0; $i -lt $itemCount; $i++) {
        $item = $items[$i]
        
        # Skip if we've already processed this path
        if ($processedPaths -contains $item.FullName) {
            continue
        }
        [void]$processedPaths.Add($item.FullName)
        
        $isLast = ($i -eq ($itemCount - 1))
        $connector = if ($isLast) { "└── " } else { "├── " }
        $icon = if ($item.PSIsContainer) { "📁" } else { "📄" }
        
        [void]$output.Add("$indent$connector$icon $($item.Name)")
        
        if ($item.PSIsContainer) {
            $newIndent = if ($isLast) { "$indent    " } else { "$indent│   " }
            $childItems = Get-ProjectStructure -path $item.FullName -indent $newIndent -exclude $exclude -processedPaths $processedPaths
            foreach ($childItem in $childItems) {
                [void]$output.Add($childItem)
            }
        }
    }
    
    return $output
}

function Get-FileStats {
    param ([string]$path = ".")
    
    $stats = @{
        TotalFiles = 0
        TotalDirectories = 0
        FileTypes = @{}
        TotalSize = 0
    }
    
    Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\bin\\|\\obj\\|\.git\\|\.vs\\' } |
    ForEach-Object {
        if ($_.PSIsContainer) {
            $stats.TotalDirectories++
        } else {
            $stats.TotalFiles++
            $stats.TotalSize += $_.Length
            $extension = if ($_.Extension) { $_.Extension } else { "(no extension)" }
            $stats.FileTypes[$extension] = ($stats.FileTypes[$extension] ?? 0) + 1
        }
    }
    return $stats
}

function Format-FileSize {
    param ([long]$size)
    $suffixes = "B", "KB", "MB", "GB", "TB"
    $i = 0
    while ($size -ge 1024 -and $i -lt $suffixes.Count) {
        $size = $size / 1024
        $i++
    }
    return "{0:N2} {1}" -f $size, $suffixes[$i]
}

function Get-EnvironmentInfo {
    $info = [ordered]@{
        "PowerShell Version" = $PSVersionTable.PSVersion.ToString()
        ".NET Version" = "Not installed"
        "Node.js Version" = "Not installed"
        "npm Version" = "Not installed"
        "Git Version" = "Not installed"
        "pnpm Version" = "Not installed"
    }
    
    try { $info[".NET Version"] = (dotnet --version) } catch { }
    try { $info["Node.js Version"] = (node --version).TrimStart('v') } catch { }
    try { $info["npm Version"] = (npm --version) } catch { }
    try { $info["Git Version"] = (git --version).Replace('git version ', '') } catch { }
    try { $info["pnpm Version"] = (pnpm --version) } catch { }
    
    return $info
}

# Main script execution
$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$projectName = Split-Path -Leaf (Get-Location)
$outputFile = "${projectName}_Structure_${timestamp}.txt"

# Generate Header
$header = @"
#################################################
Project Documentation: $projectName
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
#################################################

"@

# Get Project Structure
$structure = "PROJECT STRUCTURE`n---------------`n"
$structure += Get-ProjectStructure | Out-String

# Get Git Information
$gitInfo = @"
GIT INFORMATION
--------------
Current Branch: $(git branch --show-current 2>$null)
Remote Origin: $(git remote get-url origin 2>$null)

Recent Commits:
$(git log -n 5 --pretty=format:" - %h - %an, %ar : %s" 2>$null)

"@

# Get Project Statistics
$stats = Get-FileStats
$projectStats = @"
PROJECT STATISTICS
-----------------
Total Files: $($stats.TotalFiles)
Total Directories: $($stats.TotalDirectories)
Total Size: $(Format-FileSize $stats.TotalSize)

File Types:
$(($stats.FileTypes.GetEnumerator() | Sort-Object Value -Descending | 
  ForEach-Object { "  $($_.Key): $($_.Value) files" }) -join "`n")

"@

# Get Environment Information
$envInfo = "ENVIRONMENT INFORMATION`n---------------------`n"
$environmentInfo = Get-EnvironmentInfo
foreach ($item in $environmentInfo.GetEnumerator()) {
    $envInfo += "{0}: {1}`n" -f $item.Key, $item.Value
}

# Combine all sections and write to file
$content = @($header, $structure, $gitInfo, $projectStats, $envInfo) -join "`n"
$content | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "Project documentation has been saved to $outputFile" -ForegroundColor Green
Write-Host "Generated sections:" -ForegroundColor Yellow
Write-Host " - Project Structure" -ForegroundColor Cyan
Write-Host " - Git Information" -ForegroundColor Cyan
Write-Host " - Project Statistics" -ForegroundColor Cyan
Write-Host " - Environment Information" -ForegroundColor Cyan