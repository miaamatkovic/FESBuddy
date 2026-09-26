import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token is not valid" });
  }
};

//provjerava JWT koji se nalazi u cookieju accessToken i autentificira zahtjev prije nego što dođe do 
// zaštićenih ruta.
// Ako je token valjan, iz njega izvlači ID korisnika i dodaje ga u req objekt kao req.userId,
// omogućujući daljnje rukovanje zahtjevom s informacijom o autentificiranom korisniku.

