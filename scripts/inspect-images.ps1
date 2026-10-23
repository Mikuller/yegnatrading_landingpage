Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Recurse public -Include *.jpg, *.png
foreach ($f in $files) {
    if ($f.Length -gt 100KB) {
        try {
            $img = [System.Drawing.Image]::FromFile($f.FullName)
            [PSCustomObject]@{
                Name = $f.Name
                Width = $img.Width
                Height = $img.Height
                SizeKB = [math]::Round($f.Length / 1024, 1)
            }
            $img.Dispose()
        } catch {}
    }
}
