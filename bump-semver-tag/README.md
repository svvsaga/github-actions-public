     _       ____   _____   ___    ___    _   _           ____     ___     ____   ____  
    / \     / ___| |_   _| |_ _|  / _ \  | \ | |         |  _ \   / _ \   / ___| / ___| 
   / _ \   | |       | |    | |  | | | | |  \| |  _____  | | | | | | | | | |     \___ \ 
  / ___ \  | |___    | |    | |  | |_| | | |\  | |_____| | |_| | | |_| | | |___   ___) |
 /_/   \_\  \____|   |_|   |___|  \___/  |_| \_|         |____/   \___/   \____| |____/ 
                                                                                        
## Description

Reads the latest tag, increments the version if a \#major, \#minor or \#patch tag is found in any commit msg in push, and creates a new tag.

## Inputs

| parameter | description | required | default |
| - | - | - | - |
| token | GitHub token. Defaults to `github.token`. | `true` | ${{ github.token }} |


## Outputs

| parameter | description |
| - | - |
| tag | The new tag, or empty string if no tag was created. |
| version | The new version (tag without v-prefix), or empty string if no version was incremented. |


## Runs

This action is a `node16` action.


