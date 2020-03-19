ONLY ONCE: 
	- download node.js
CODE RUNNEN
	- navigeer naar de map waar sfxApp.js staat
	- shift+right-click in de map
	- selecteer open powershell op deze locatie 
	- (je kunt ook via powershell naar deze map navigeren)
	- geef in node sfxApp.js (niet hoofdlettergevoelig)

sfx toevoegen: 
	- voeg categorie toe door: een nieuw mapje te maken in sfx
	- voeg het comando voor deze categorie toe aan soundlist.json met eventueel een beschrijving ("" if empty) (id kan tot infinite gaan)
        - voeg de categorie toe aan aan sounds.json (met dezelfde id), "name" moet hetzelfde zijn als de directory van jouw naam (gezien vanaf ./sfx)
        - sfxname is de lijst van sfx-namen (zonder extentie (has to be .mp3)) in die categorie
	- sfxbtn zijn de knoppen die overeen komen met elk geluidje. ("/" voor een emojii to copy paste from discord)

	
 mappen structuur:


/
	./node_modules
	./sfx	
		./_allsfx
			./*.mp3
		./class
			./*.mp3
	./config.json
	./package-lock.json
	./sfxApp.js
	./soundlist.json
	./sounds.json
