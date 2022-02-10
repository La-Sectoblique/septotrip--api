import "dotenv/config";
import Database from "./core/Database";

Database().then( () => console.log("pouet") );