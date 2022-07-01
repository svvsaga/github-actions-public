     _       ____   _____   ___    ___    _   _           ____     ___     ____   ____  
    / \     / ___| |_   _| |_ _|  / _ \  | \ | |         |  _ \   / _ \   / ___| / ___| 
   / _ \   | |       | |    | |  | | | | |  \| |  _____  | | | | | | | | | |     \___ \ 
  / ___ \  | |___    | |    | |  | |_| | | |\  | |_____| | |_| | | |_| | | |___   ___) |
 /_/   \_\  \____|   |_|   |___|  \___/  |_| \_|         |____/   \___/   \____| |____/ 
                                                                                        
## Description

Find if any commits in a push are tagged as major, minor or patch versions. Requires checking out the code beforehand.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| token | GitHub token. Defaults to `github.token`. | `true` | ${{ github.token }} |


## Outputs

| parameter | description |
| - | - |
| severity | Severity of the push; major, minor, patch or null. |


## Runs

This action is a `node16` action.


