var express = require('express');
var router = express.Router();
const sql = require('mssql');
const config = {
  user: 'gottardo.joshua',  //Vostro user name
  password: 'xxx123#', //Vostra password
  server: "213.140.22.237"  //Stringa di connessione
  /* database: '4DD_01' (Nome del DB) */
}

/* GET users listing. */
router.get('/unita', function(req, res, next) {
  sql.connect(config, err => {
    if(err) console.log(err);  // ... error check
    // Query
    let sqlRequest = new sql.Request();  //Oggetto che serve a creare le query
    sqlRequest.query('select * from [cr-unit-attributes]', (err, result) => {
        if (err) console.log(err); // ... error checks
        res.render('elencounita',{unita: result.recordsets[0]});  //Invio il risultato
    });
  });
});

router.get('/inserisci', function(req, res, next) {
    res.render('inserisci');
});

router.get('/elenco', function(req, res, next) {
  sql.connect(config, err => {
    if(err) console.log(err);  // ... error check
    // Query
    let sqlRequest = new sql.Request();  //Oggetto che serve a creare le query
    sqlRequest.query('select * from [cr-unit-attributes]', (err, result) => {
        if (err) console.log(err); // ... error checks
        res.send(result.recordsets[0])  //Invio il risultato
    });
  });
});

router.get('/dettagli/:name', function(req, res, next) {
  sql.connect(config, err => {
    // ... error check
    if(err) console.log(err);
    // Query
    let sqlRequest = new sql.Request();
    sqlRequest.query(`select * from [cr-unit-attributes] where Unit = '${req.params.name}'`, (err, result) => {
        // ... error checks
        if (err) console.log(err);

        res.render('dettagli', {unita: result.recordsets[0][0]})
    });
  });
});

router.get('/search/:name', function(req, res, next) {
  sql.connect(config, err => {
    // ... error check
    if(err) console.log(err);
    // Query
    let sqlRequest = new sql.Request();
    sqlRequest.query(`select * from [cr-unit-attributes] where Unit = '${req.params.name}'`, (err, result) => {
        // ... error checks
        if (err) console.log(err);

        res.send(result);
    });
  });
});

let executeQuery = function (res, query, next) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      res.send(result.recordset); //Il vettore con i dati è nel campo recordset (puoi loggare result per verificare)
      sql.close();
    });

  });
}

router.post('/', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body;
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
    let sqlRequest = new sql.Request();
    let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes] (Unit,Cost,Hit_Speed,Speed,Deploy_Time,Range,Target) 
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}','${unit.Speed}','${unit.DeployTime}','${unit.Range}','${unit.Target}')`;
    sqlRequest.query(sqlInsert, (error, results) => {
        sqlRequest.query(`SELECT * FROM [cr-unit-attributes] WHERE Unit = '${unit.Unit}'`, (err, result) => {
            if (err) console.log(err);
            res.render('dettagli', { unita: result.recordsets[0][0] });
        });
    });
});

module.exports = router;
