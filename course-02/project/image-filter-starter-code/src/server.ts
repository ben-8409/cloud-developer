import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter image
  app.get( "/filteredimage", 
    async ( req: express.Request, res: express.Response ) => {
    const { image_url } = req.query;

    //validate that there is a image_url in the query
    if( !image_url ) {
      return res.status(400).send("query parameter image_url is required");
    }
  
    const file = await filterImageFromURL(image_url);

    res.sendFile(file, async function (err) {
      await deleteLocalFiles([file])
      if (err) {
        return res.status(500).send(err);
      } else {
        console.log('Sent:', file)
      }
    })

  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
