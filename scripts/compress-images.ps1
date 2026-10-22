Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param(
        [string]$Path,
        [int]$MaxWidth = 800,
        [int]$MaxHeight = 800,
        [long]$Quality = 82
    )
    
    if (-not (Test-Path $Path)) { return }
    $file = Get-Item $Path
    $origBytes = $file.Length
    
    $origImage = [System.Drawing.Image]::FromFile($Path)
    $origW = $origImage.Width
    $origH = $origImage.Height
    
    # Calculate scaled dimensions preserving aspect ratio
    $ratio = [math]::Min($MaxWidth / $origW, $MaxHeight / $origH)
    if ($ratio -ge 1.0) {
        $ratio = 1.0
    }
    $newW = [int][math]::Round($origW * $ratio)
    $newH = [int][math]::Round($origH * $ratio)
    
    $bmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graph.DrawImage($origImage, 0, 0, $newW, $newH)
    $origImage.Dispose()
    $graph.Dispose()
    
    $tempPath = $Path + ".tmp"
    
    if ($Path.EndsWith(".png", [System.StringComparison]::OrdinalIgnoreCase)) {
        $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
        # JPEG with specified quality encoder
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        $bmp.Save($tempPath, $codec, $encoderParams)
        $encoderParams.Dispose()
    }
    $bmp.Dispose()
    
    Move-Item -Path $tempPath -Destination $Path -Force
    $newFile = Get-Item $Path
    $newBytes = $newFile.Length
    $savedPct = [math]::Round((1 - ($newBytes / $origBytes)) * 100, 1)
    
    Write-Host ("Optimized: {0} ({1}KB -> {2}KB, saved {3}%)" -f $file.Name, [math]::Round($origBytes/1024,1), [math]::Round($newBytes/1024,1), $savedPct)
}

Compress-Image -Path "public/images/ceo.jpg" -MaxWidth 640 -MaxHeight 640 -Quality 82
Compress-Image -Path "public/images/team-getahun.jpg" -MaxWidth 600 -MaxHeight 800 -Quality 82
Compress-Image -Path "public/images/team-mulugeta.jpg" -MaxWidth 600 -MaxHeight 600 -Quality 82
Compress-Image -Path "public/images/team-tilahun.png" -MaxWidth 600 -MaxHeight 600
Compress-Image -Path "public/images/blood-1.jpg" -MaxWidth 640 -MaxHeight 800 -Quality 80
Compress-Image -Path "public/images/blood-2.jpg" -MaxWidth 500 -MaxHeight 800 -Quality 80
Compress-Image -Path "public/images/blood-3.jpg" -MaxWidth 640 -MaxHeight 800 -Quality 80
Compress-Image -Path "public/rebar-hero.png" -MaxWidth 640 -MaxHeight 640
