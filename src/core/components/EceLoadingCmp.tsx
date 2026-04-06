import { Box,  CircularProgress, Typography} from "@mui/material";

interface EceLoadingProps
{
  message: string
}

function EceLoadingCmp(props: EceLoadingProps)
{
  return (
    <Box
    sx=
    {{ 
      height        : '100vh', 
      display       : 'flex', 
      flexDirection : 'column',
      alignItems    : 'center', 
      justifyContent: 'center',
    }}>
      <CircularProgress
      sx=
      {{
        mb: 2
      }}/>

      <Typography
      variant="body2"
      >
        {props.message}...
      </Typography>

    </Box>
  );
}

export default EceLoadingCmp;

