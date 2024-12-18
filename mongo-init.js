db = db.getSiblingDB("fhir");
db.createUser({
  user: "fhir-user",
  pwd: "fhir-password",
  roles: [{ role: "readWrite", db: "fhir" }],
});
