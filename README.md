Para poder ejecutar la aplicación en servidor web se requiere tener instalado ionic y angular en la maquina, luego puede ejecutar en consola ng serve o ionic serve para que
se despliegue un servidor local.

El apk de la aplicación se encuentra en la ruta relativa myApp\android\app\build\outputs\apk, para contruir nuevamente se pueden ejecutar los siguientes comandos en consola:

ionic build --prod
npx cap sync android

si se tiene andorid studio se puede finalizar la construcción con el siguiente comando:
npx cap open android

si se requiere por comandos se puede crear de esta forma con gredlew:
cd android
./gradlew assembleRelease

el archivo se constuye en la ruta android/app/build/outputs/apk/release/app-release.apk o en la anteriormente mencionada

Para construir el archivo .ipa se requiere una maquina Apple ya que se requiere el programa nativo de IOS xcodebuild, sin embargo el proyecto esta listo para crear el archivo, 
ya se agregó la ruta y los archivos necesarios en la carpeta ios con capacitor y cordova.

se deben ejecutar los siguientes comandos:
npx cap add ios
ionic build --prod
npx cap sync ios
npx cap open ios

esto abrira el programa Xcode nativo de IOS
desde el programa se puede generar el .ipa
