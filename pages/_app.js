import Head from 'next/head';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Grid, Toolbar, Box } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '../components';

import '../styles/global.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const drawerWidth = 300;

function Neon({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
    </Head>
    <SessionProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: "100%" }}>
          <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Navbar drawerWidth={drawerWidth} />
          </Box>
          <Box sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  </>
}

export default Neon;
