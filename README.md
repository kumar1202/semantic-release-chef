# semantic-release-chef
semantic-release plugin for automating chef cookbook releases

## Flow: 

Prepare Step
- Update metadata file with new tag
- Run berks install to update Berksfile.lock

Publish Step
- Publish cookbook to local supermarket

Configs

Required configs
cookbookPublish: true/false
updateLockfile: true/false

Optional configs
metadataPath: default will be metadata.rb
berksfilePath: default will be Berksfile.rb
supermarketPublish:
    supermarketSite: default will be https://supermarket.chef.io
    category: default is "Other"
berksPublish:
    chefEnv: [integration, production] will be default