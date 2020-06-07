import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

const token = process.env.APP_TOKEN;

if(!token) {
  throw new Error("No App token found. Make sure APP_TOKEN is set.")
} else {
  (async () => {

    // Init the Express application
    const app = express();
  
    // Set the network port
    const port = process.env.PORT || 8082;
    
    // Use the body parser middleware for post requests
    app.use(bodyParser.json());
  
    // Use the requireAuth middleware for filteredimage path
    app.use( "/filteredimage", function (req, res, next) {
      if (!req.headers || !req.headers.token){
        return res.status(401).send({ message: 'No authorization headers.' });
      }
      
      if (req.headers.token !== token) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
  
      next();
    })
  
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    // IT SHOULD
    //    1
    //    1. validate the image_url query
    //    2. call filterImageFromURL(image_url) to filter the image
    //    3. send the resulting file in the response
    //    4. deletes any files on the server on finish of the response
    // QUERY PARAMATERS
    //    image_url: URL of a publicly accessible image
    // RETURNS
    //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  
    /**************************************************************************** */
    app.get( "/filteredimage", 
      async (req, res) => {
      const { image_url } = req.query;
  
      //validate that there is a image_url in the query
      if( !image_url ) {
        return res.status(400).send("query parameter image_url is required");
      }
  
      console.log(image_url)
  
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
    //! END @TODO1
    
    // Root Endpoint
    // Displays a simple message to the user
    app.get( "/", async ( req, res ) => {
      res.send("try GET /filteredimage?image_url={{}}")
    } );
    
  
    // Start the Server
    app.listen( port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    } );
  })();
}
