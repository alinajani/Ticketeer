import { makeStyles } from "@material-ui/core";

const loginStyles = makeStyles((theme) => ({



        Login_mainDiv: {
          height: '100%',
          width: '100%',
          fontSize: 0,
          display: 'flex', 
        },
        Login_LeftDiv: {
          display: 'inline-block',
          zoom: 1,
          verticalAlign: 'top',
          fontSize: '12px',
          width: '50%',
          backgroundColor: '#C1E1D2',
          height: '100vh',
          justifyContent: 'center',
          backgroundImage: 'URL(/fairytale.jpg)',
          backgroundSize: 'cover', // Adjust as needed
          backgroundPosition: 'center', // Adjust as needed
          backgroundRepeat: 'no-repeat',
        },

        Login_RightDiv: {
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          zoom: 1,
          verticalAlign: 'top',
          fontSize: '12px',
          width: '50%',
          backgroundColor: '#FFFFFF',
          height: '100vh',
        },

        cardContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%', 
            height: '95%', 
          },

          LoginCard:{
            height: 500,
          },

          LoginCardText:{
            fontFamily: 'Krona one',
          },

          textField: {
            width: '100%', // Adjust the width as needed
            marginBottom: theme.spacing(2), // Adjust the margin as needed
        },

        LoginCheckBoxDiv:{
          marginTop: 0,
          marginLeft:5,
          marginBottom: -18,
        },

        RememberMeText: {
          display: 'inline-block',
        },
        
        RememberMeCheckbox: {
          display: 'inline-block',
        },

        LoginButtonDiv:{
          display: 'flex',
          justifyContent: 'center',
        },

        LoginButton:{
          backgroundColor:'#000000',
          color:'#FCFBF4',
          fontFamily: "Krona one",
          borderRadius: 30,
          padding: 20,
          position: 'relative'
      },

      Card:{
        display: 'flex',

      },

      LinksDiv:{
        display: 'flex', 
        justifyContent: 'space-between'
      },

      ForgotPassDiv:{
        display: 'inline-block',
      },

      AlrAccDiv:{
        display: 'inline-block',
      }


}));

export default loginStyles;