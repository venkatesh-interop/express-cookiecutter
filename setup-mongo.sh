#!/bin/bash

# Configuration variables
MONGO_INITDB_ROOT_USERNAME="root"
MONGO_INITDB_ROOT_PASSWORD="root"
MONGO_DATABASE="fhir"
MONGO_USER="fhir-user"
MONGO_USER_PASSWORD="fhir-password"

# Function to create a user and database
function create_user_and_database() {
  echo "Creating user and database in MongoDB..."

  mongo -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin <<EOF
use $MONGO_DATABASE;
db.createUser({
  user: "$MONGO_USER",
  pwd: "$MONGO_USER_PASSWORD",
  roles: [{ role: "readWrite", db: "$MONGO_DATABASE" }]
});
EOF

  echo "User '$MONGO_USER' with access to database '$MONGO_DATABASE' created successfully."
}

# Execute the function
create_user_and_database
