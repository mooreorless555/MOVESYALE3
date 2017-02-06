# MOVESYALE
### *(reuploaded)*

Same Moves app, new repo! (For the THIRD TIME! OMG.) Chris and Sam diverged too much on their own without making commits, had an issue with FB authentication and therefore Chris used what was on the Git and manually fixed all merges as well as overhauled the code structure.

If you're collabing with us and want to get up and running, make sure you've already installed cordova and ionic.

- Download this repo.
- cd to the repo and run `npm install`
- [Hit up Sam's repo for the backend.](https://github.com/smbddha/moves_backend)
- Put his repo in a folder called "backend" inside this repo and run `npm install` in that new folder.
then you should be all set on the basics. Finally, cd back to this repo and run
```
ionic serve --lab
```
If you're getting errors, you may be missing some native plugins.

---
## Native Plugins
You need to install these plugins for the app to be fully functional.

```
ionic plugin add cordova-plugin-facebook4 --variable APP_ID="xxxxxxxxxxxxxx" --variable APP_NAME="name"
```
Ask me or Sam personally for the APP_ID and APP_NAME.
```
ionic plugin add cordova-plugin-geolocation
```
```
ionic plugin add cordova-plugin-mauron85-background-geolocation
```
```
ionic plugin add cordova-plugin-statusbar
```
```
ionic plugin add cordova-plugin-splashscreen
```
```
npm install --save sweetalert2
```

If you have any questions just message me or Sam!
