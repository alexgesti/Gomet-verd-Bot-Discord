const express = require("express");

const app = express();


app.get("/", (req, res) => {

    res.send(
        "Gomets Verds Bot activo"
    );

});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Servidor HTTP activo en puerto ${PORT}`
    );

});