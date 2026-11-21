import { ucitajZadatke, spremiZadatke } from "./pohrana.js";

const [naredba, arg1] = process.argv.slice(2);

let zadaci;
try {
  zadaci = await ucitajZadatke();
} catch (error) {
  console.error(`Datoteka zadaci.json nije ispravna: ${error.message}`);
  process.exit(1);
}

switch (naredba) {
  case "dodaj": {
    if (!arg1 || arg1.trim() === "") {
      console.error('Korištenje: node glavni.js dodaj "Naslov zadatka"');
      process.exit(1);
    }

    let noviId = 1;
    if (zadaci.length > 0) {
      noviId = Math.max(...zadaci.map((z) => z.id)) + 1;
    }

    const noviZadatak = {
      id: noviId,
      naslov: arg1.trim(),
      gotovo: false,
    };

    zadaci.push(noviZadatak);
    await spremiZadatke(zadaci);

    console.log(`Dodan zadatak [${noviId}]: ${noviZadatak.naslov}`);
    break;
  }

  case "popis": {
    if (zadaci.length === 0) {
      console.log("Nema zadataka.");
    } else {
      for (const zadatak of zadaci) {
        const oznaka = zadatak.gotovo ? "[x]" : "[ ]";
        console.log(`${zadatak.id}. ${oznaka} ${zadatak.naslov}`);
      }
    }
    break;
  }

  case "gotovo": {
    const id = Number(arg1);

    if (!arg1 || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
      console.error("Korištenje: node glavni.js gotovo <broj>");
      process.exit(1);
    }

    const zadatak = zadaci.find((z) => z.id === id);
    if (!zadatak) {
      console.error(`Zadatak s brojem ${id} ne postoji.`);
      process.exit(1);
    }

    zadatak.gotovo = true;
    await spremiZadatke(zadaci);

    console.log(`Zadatak ${id} označen kao gotov.`);
    break;
  }

  default:
    console.error("Nepoznata naredba. Koristi: dodaj, popis, gotovo.");
    process.exit(1);
}