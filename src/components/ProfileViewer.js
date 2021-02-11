
import {
  useSession,
  CombinedDataProvider,
  Image,
  LogoutButton,
  Text,
} from "@inrupt/solid-ui-react";

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import { useState, useEffect } from "react";
import { FOAF, VCARD } from "@inrupt/lit-generated-vocab-common";

const ProfileViewer = ({ onLogout }) => {
  const { session } = useSession();
  const { webId } = session.info;


  console.log(session.info.isLoggedIn)
  if (!session.info.isLoggedIn)
{ 
      onLogout()
  }

  return (
    <Container fixed>
      <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
        <Card style={{ maxWidth: 480 }}>
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <Text property={FOAF.name.iri.value} />
            </Typography>
        </CardContent>

          <CardActionArea
            style={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Image property={VCARD.hasPhoto.iri.value} width={480} />
          </CardActionArea>


        </Card>
      </CombinedDataProvider>
      <LogoutButton>
        <Button variant="contained" color="primary">
          Log&nbsp;out
        </Button>
  </LogoutButton>
    </Container>
   
  );
}

export default ProfileViewer