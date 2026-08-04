const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const { durationDays, travelStyle, destinationsOfInterest, budgetLevel, userNote } = req.body;',
  'const { durasiHari: durationDays, profilWisatawan, preferensiMinat, anggaran } = req.body;\n      const travelStyle = profilWisatawan?.kategori;\n      const destinationsOfInterest = preferensiMinat?.kategoriWisata;\n      const budgetLevel = anggaran?.rentang;'
);

fs.writeFileSync('server.ts', code);
