@echo off
REM Changer le répertoire vers le backend
cd U:\makrem-chouref2\backend\
REM Démarrer le serveur backend dans une nouvelle fenêtre
start cmd /k "yarn start" 

REM Changer le répertoire vers le frontend
cd ..\front
REM Démarrer le frontend dans une nouvelle fenêtre
start cmd /k "npm run dev" 
