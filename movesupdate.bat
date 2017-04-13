call npm cache clean
rmdir /s node_modules
call npm cache clean
call npm cache clear
call npm uninstall -g ionic
call npm install
call npm install -g ionic@latest
call npm install @ionic/app-scripts@latest
call npm install @ionic-native
call npm install @ionic-native/core
call npm install @ionic-native/facebook
call ionic serve --lab