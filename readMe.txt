ONLY ONCE: 
	- download node.js (runt javascript op uw computer)

	- open config.json (met notepad)
		-  pas het nummer achter ' "bot_controler" : ' aan naar jouw discord id (als je die niet weet kijk naar sfxApp.js in de methode: bot.on('voiceStateUpdate', (oldMember, newMember) )=> daar staat usere-id van ons 4
	DEZE STAP IS NORMAAL NIET NODIG
		- npm install <bhu> (stuur mij dan een bericth


CODE RUNNEN
	- navigeer naar de map waar sfxApp.js staat
	- shift+right-click in de map
	- selecteer open powershell op deze locatie 
	- (je kunt ook via powershell naar deze map navigeren)
	- geef in node sfxApp.js (niet hoofdlettergevoelig)

CODE AANPASSEN
	SFX -> selecteer een map om sound effect in toe te voegen (zou duidelijk moeten zijn)
	als je een sfx toevoegt in een submap van sfx moet je de fileName (ZONDER EXTENTIE) in dezelfde array toevoegen en de button die daarbij hoort moet op dezelfde plaats staan in de button array 
  	(om code te editten gebruik je best webstorm of visual studio)
	
 	