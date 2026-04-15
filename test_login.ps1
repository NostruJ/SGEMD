$body = @{
    CorreoInstitucional = 'admin@sgemd.com'
    Password = 'Admin2024!'
} | ConvertTo-Json

try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3006/segmed/users/login' -Method POST -Body $body -ContentType 'application/json'
    Write-Host "Status: $($r.StatusCode)"
    Write-Host "Response: $($r.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
