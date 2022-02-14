# Solid React basic example with TypeScript

This is a sample react application that uses solid components.

Documentation links:
- [Solid UI-react documentation](https://solid-ui-react.docs.inrupt.com/)
- [Source code](https://github.com/inrupt/solid-ui-react)
- [Classes for handling the authentication](https://docs.inrupt.com/developer-tools/api/javascript/solid-client-authn-browser/)
- [Main documentation site](https://docs.inrupt.com/)

## Using the repository

Install dependencies

```bash
npm install
```

Run the code:

```
npm start
```

## Creating a SOLID app from scratch

First, create a React application with `npx create-react-app solid-react-example`. This command will create a react sample application in the directory solid-react-example.

Lets add a dependecy to this project. We want to use [solid components](https://github.com/inrupt/solid-ui-react), lets use npm to add the required dependencies:

```bash
cd solid-react-example
npm install @inrupt/solid-ui-react
```

in the file `package.json` you can see now that the line `"@inrupt/solid-ui-react": "^2.1.1"` has been added. This file is critical to install the dependencies in another computer (using `npm install`).

Lets install also two other dependencies that are needed for this project:

```bash
npm install @inrupt/lit-generated-vocab-common
npm install @material-ui/core
```

Now lets modify the code so we can use this components to make a basic login page against a solid server and then show some basic information extracted from the POD.


### The main application component
This component application will have two subcomponents, depending if we are logged in or not. If we are not logged in, we will show the `LoginForm` component. If we are already logged in, we will show some information from the user pod, using the `ProfileViewer` component.

Note that we have two listener to know when the login changes. We use these listener to handle the `isLoggedIn` state variable. React will handle the rest, changing the virtual dom depending on the value of this variable.

```javascript
const App = () => {
  //We use this state variable
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //With this we can control the login status for solid
  const { session } = useSession();

  //We have logged in
  session.onLogin(()=>{
    setIsLoggedIn(true)
  })

  //We have logged out
  session.onLogout(()=>{
    setIsLoggedIn(false)
  })

  return(
    <SessionProvider sessionId="log-in-example">
      {(!isLoggedIn) ? <LoginForm/> : <ProfileViewer/>}
    </SessionProvider>
  )
}
```

### How to login
For logging in, we have a `LoginButton` component. Login in solid is carried out by another site (the pod provider), so we must handle the redirect when comming back from the login process.

```javascript
const LoginForm = () => {
  const [idp, setIdp] = useState("https://inrupt.net");
  const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  return (
    <Container fixed>
      <FormGroup>
        <TextField
          label="Identity Provider"
          placeholder="Identity Provider"
          type="url"
          value={idp}
          onChange={(e) => setIdp(e.target.value)}
          InputProps={{
            endAdornment: (
              <LoginButton oidcIssuer={idp} redirectUrl={currentUrl}>
                <Button variant="contained" color="primary">
                  Login
                  </Button>
              </LoginButton>
            ),
          }}
        />
      </FormGroup>
    </Container>
  );
}
```

Note the `useEffect` hook. It allows us to execute some code when the component is mounted. Using `setCurrentUrl` as a parameter means that this function will only get executed when this value changes. 

### Showing some profile information
Once we are logged in, we can proceed to show some profile information. In this little example we are showing the user name, the organization to which the user belongs and its picture. For that, we use the solid react components that allow us to easily show this information without having to use the internal language used for this queries.

```javascript
const ProfileViewer = () => {
  const { session } = useSession();
  const { webId } = session.info;

  return (
    <Container fixed>
      <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
        <Card style={{ maxWidth: 480 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <Text property={FOAF.name.iri.value} />
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{ display: "flex", alignItems: "center" }}>
              <Text property={VCARD.organization_name.iri.value} />
            </Typography>
          </CardContent>

          <CardActionArea style={{ justifyContent: "center", display: "flex" }}>
            <Image property={VCARD.hasPhoto.iri.value} width={480} />
          </CardActionArea>
        </Card>
      </CombinedDataProvider>
      <LogoutButton >
        <Button style={{ marginTop: 20 }} variant="contained" color="primary">
          Logout
        </Button>
      </LogoutButton>
    </Container>
  );
}
```