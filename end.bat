docker kill mongo-test
$myLabel = 'MyImportantScript'
$p       = Get-Process -Name 'powershell' | Where-Object CommandLine -like "*-CustomPipeName '$myLabel'*"
Stop-Process -ID ($p).id -Force