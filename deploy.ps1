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

echo "removing old version."
ssh -i $keyPath -o "StrictHostKeyChecking=no" -q $user@$url "rm -r $prodDir*"

echo "deploying new version."
scp -i $keyPath -o "StrictHostKeyChecking=no" -q -r "$packageDir*" $user@"$url":$prodDir

echo "deployed successfully."
