# Before submitting & deploying, make sure you have:
# - had no coffee
# Deploy with ".\deploy.ps1".

ng build

$config = get-content "./deploy.json" | convertFrom-json
$url = $config.url
$user = $config.user
$keyPath = $config.keyPath
$packageDir = $config.packageDir
$prodDir = $config.prodDir

ssh -i $keyPath -o StrictHostKeyChecking = no $user@$url "rm -r $prodDir*"
ssh -i $keyPath -o StrictHostKeyChecking = no $user@$url "mkdir $prodDir"

scp -i $keyPath -o StrictHostKeyChecking = no -r "$packageDir*" $user@"$url":$prodDir
