$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Listening on http://localhost:8080/'

$basePath = 'c:\Users\Estudiantes\Documents\Antigravity\portafolio 3'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    $requestUrl = $context.Request.Url.LocalPath

    if ($requestUrl -eq '/') {
        $requestUrl = '/index.html'
    }

    $filePath = Join-Path $basePath $requestUrl.TrimStart('/')

    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)

        $contentType = 'application/octet-stream'
        if ($ext -eq '.html') { $contentType = 'text/html; charset=utf-8' }
        if ($ext -eq '.css') { $contentType = 'text/css; charset=utf-8' }
        if ($ext -eq '.js') { $contentType = 'application/javascript; charset=utf-8' }

        $response.ContentType = $contentType
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }

    $response.Close()
}
