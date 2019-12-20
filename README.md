# Getting Started

1. openssl req -nodes -new -x509 -keyout server.key -out server.cert

- Most answers don't matter but for 'Common Name' use `localhost`

2. Once the certificate has been created you'll need to add to your operating system

## macOS
- open Keychain Access. 

- File -> Import Items... and select the `server.cert` file.

- Once imported, in the lower left hand corner of Keychain select 'Certificates'. 

- Open your `localhost` certificate by double clicking.

- Open the drop-down called 'Trust' and update 'When using this certificate:' to `Always Trust`. This will require administrator confirmation.

## Windows

TODO: add windows instructions

## Continue Getting Started

3. Run `npm install`

4. Run `npm run start`

5. Open a browser and go to `https://localhost:8080`
- Note: The browser will correctly warn you that the certificate is not valid (since it is self-signed). You can "proceed" and the URL will say "NOT SECURE" but you are now using HTTPS.

6. Profit! You've successfully setup HTTPS locally.

## Notes
- Safari only allows httpOnly cookies to be set for the same domain.

Based in part:
- https://flaviocopes.com/express-https-self-signed-certificate/
- https://stackoverflow.com/questions/54836702/redirect-from-http-to-https-using-node-js-express