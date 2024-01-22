const express = require("express");

const app = express();
const cors = require("cors"); // Cors ist eine Funktion

app.use(cors());

const sqlite3 = require("sqlite3");

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Verbindung zum Datenbank-Datei aufbauen

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

 

let db = new sqlite3.Database("./myproject.db", (fehler) => {

  if (fehler) console.error(fehler.message);

  else

    console.log("Verbindung zum Database myproject.db erfolgreich aufgebaut :-)");

});


const PortNummer = 8082;

app.get("/abruf/dual/tabelle", (req, res) => {
  db.all(`SELECT * FROM Dual`, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});


app.get("/abruf/dual/studi", (req, res) => {
  db.all(`SELECT Studienmodell FROM Dual`, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});
 
//----
app.get("/abruf/dual/stadt", (req, res) => {
  db.all(`SELECT Stadt FROM Dual`, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});
 
//----
app.get("/abruf/dual/Zeitmodell", (req, res) => {
  db.all(`SELECT Zeitmodell FROM Dual`, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});
 
//----
//----
app.get("/abruf/dual/hochschulbereich", (req, res) => {
  db.all(`SELECT Hochschulbereich FROM Dual`, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});
 
//----

app.get("/abruf/dual/:konto/:begriff", (req, res) => {

  let b = req.params.begriff;

  let k = req.params.konto;

  db.all(

    `SELECT * FROM Dual WHERE (

      Hochschulbereich LIKE '%${b}' OR Hochschulbereich LIKE '%${b}%' OR Hochschulbereich LIKE '${b}%'  ) AND DuID <> '${k}'`,

    (fehler, zeilen) => {

      console.log(zeilen);

      res.send(JSON.stringify(zeilen));

    }

  );

});
 
app.get("/login/:u/:p", (req, res) => {
  db.all(
    `SELECT * FROM Admin
      WHERE EINTRAG1 = 'adminUser'
      AND EINTRAG2 = 'adminKonto'
      AND WERT = '${req.params.u},${req.params.p}'`,
    (fehler, zeilen) => {
      res.send(zeilen.length > 0 ? "1" : "0");
    }
  );
});
//----

 
//----

 

 
//
 
app.get("/abruf/datenschutz", (req, res) => {
  db.all(
    `SELECT * FROM Admin WHERE  EINTRAG1 = 'Datenschutz'`,
 
    (fehler, zeilen) => {
      res.send(JSON.stringify(zeilen));
    }
  );
});
 
//----
 
app.get("/abruf/impressum/", (req, res) => {
  db.all(
    `SELECT  WERT FROM Admin WHERE  EINTRAG1 = 'Impressum'`,
 
    (fehler, zeilen) => {
      res.send(JSON.stringify(zeilen));
    }
  );
});
 
//----
 
app.get("/ablegen/kontakt/:objekt", (req, res) => {
  const o = JSON.parse(req.params.objekt);
 
  db.run(
    `INSERT INTO Studienberatung
 
      ( Vorname , Nachname , Telefon , Email , Nachricht )
 
      VALUES
 
      ( '${o.Vorname}', '${o.Nachname}', '${o.Telefon}', '${o.Email}', '${o.Nachricht}' )`,
 
    (fehler) => console.error(fehler)
  );
 
  res.send("ok");
});
 

//----
 
app.get("/admin/dual/aendern/:studienmodell/:stadt/:hochschulbereich/:Zeitmodell/:duID", (req, res) => {
  const o = req.params;
  db.run(
    `UPDATE  Dual  SET
    Studienmodell = '${o.studienmodell}',
    Stadt = '${o.stadt}',
    Hochschulbereich = '${o.hochschulbereich}',
    Zeitmodell = '${o.Zeitmodell}'
     WHERE DuID = '${o.duID}'`,
    (fehler) => console.error(fehler)
  );
 
  res.send("OK");
});
 
//----
 
app.get("/admin/dual/neu/:studienmodell/:stadt/:hochschulbereich/:Zeitmodell", (req, res) => {
  const o = req.params;
 
  db.run(
    `INSERT INTO Dual
 
  ( Studienmodell, Stadt, Hochschulbereich, Zeitmodell)
 
  VALUES
 
  ( '${o.studienmodell}', '${o.stadt}','${o.hochschulbereich}', '${o.Zeitmodell}' )`,
 
    (fehler) => console.error(fehler)
  );
 
  res.send("ok");
});
 
///admin/dual/entf/
 
app.get("/admin/dual/entf/:duID", (req, res) => {
  db.all(` DELETE FROM Dual WHERE DuID ='${req.params.duID}'`);
 
  res.send("ok");
});
 

 

 
//----
 

//----
 
app.get("/admin/kontakt/abruf", (req, res) => {
  db.all(`SELECT * FROM Studienberatung  `, (fehler, zeilen) => {
    res.send(JSON.stringify(zeilen));
  });
});
 
//----
 
app.get("/admin/kontaktt/entf/:kaID", (req, res) => {
  db.all(` DELETE FROM Studienberatung  WHERE KAID ='${req.params.kaID}'`);
 
  res.send("ok");
});
app.get("/admin/socialMedia/lesen/:id", (req, res) => {
  db.all(`SELECT * FROM Admin
          WHERE EINTRAG1 = 'SocialMedia-${req.params.id}'`,
        (fehler, zeile) => {
          res.send(zeile[0].WERT);
        });
});

///admin/datenschutz/lesen/
app.get("/admin/datenschutz/lesen/", (req, res) => {
  db.all(`SELECT * FROM Admin
          WHERE EINTRAG1 = 'Datenschutz'`,
        (fehler, zeile) => {
          res.send(zeile[0].WERT);
        });
});
////admin/impressum/lesen/
app.get("/admin/impressum/lesen/", (req, res) => {
  db.all(`SELECT * FROM Admin
          WHERE EINTRAG1 = 'Impressum'`,
        (fehler, zeile) => {
          res.send(zeile[0].WERT);
        });
});

app.get("/admin/socialMedia/aendern/:id/:wert", (req, res) => {
  const o = req.params;
  const e = o.id.toUpperCase();
  let sqlcode = "";
  // *** //
  switch (e) {
    case "X":
      sqlcode = `UPDATE Admin SET
               WERT = '${o.wert}'
               WHERE EINTRAG1 = 'SocialMedia-${e}'`;
      break;
    case "F":
      sqlcode = `UPDATE Admin SET
                WERT = '${o.wert}'
                WHERE EINTRAG1 = 'SocialMedia-${e}'`;
      break;
    case "G":
      sqlcode = `UPDATE Admin SET
                WERT = '${o.wert}'
                WHERE EINTRAG1 = 'SocialMedia-${e}'`;
      break;
    case "L":
      sqlcode = `UPDATE Admin SET
                 WERT = '${o.wert}'
                 WHERE EINTRAG1 = 'SocialMedia-${e}'`;
      break;
  }
  // *** //
  db.run( sqlcode,
    (fehler) => console.error(fehler)
  );
 
  res.send("OK");
});
 
//----
 
app.get("/admin/aendern/d/:text", (req, res) => {
  const o = req.params;
  db.run(
    `UPDATE Admin SET
    WERT = '${o.text}'
    WHERE EINTRAG1 = 'Datenschutz'`,
    (fehler) => console.error(fehler)
  );
 
  res.send("OK");
});
 
//----
 
app.get("/admin/aendern/i/:text", (req, res) => {
  const o = req.params;
  db.run(
    `UPDATE Admin SET
    WERT = '${o.text}'
    WHERE EINTRAG1 = 'Impressum'`,
    (fehler) => console.error(fehler)
  );
 
  res.send("OK");
});



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Der eigentliche Server ist ein Unterprogramm der ständig den angegebenen Port überprüft,

 * und schaut, ob eine Anfrage (request) angekommen ist. Wenn ja, wird die Anfrage an

 * die Routen weitergeleitet.

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const server = app.listen(

  PortNummer, // Die Portnummer, die abgehört werden soll

  () =>

    // Die Callback-Funktion, die aufgerufen wird, wenn was reinkommt

    {

      // Beispiel auf Konsole

      console.log(`Server horcht nach http://localhost:${PortNummer}/`);

    }

);

 
