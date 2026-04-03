import { useRouteError } from "react-router";
import { ece_logger } from "../logger.core";

function GlobalErrorCmp()
{
  const error = useRouteError();
  ece_logger.error('React Router Caught Error', error);

  // TODO: Implement a nice UI to tell the user that someting is wrong and a button to get him at home.
  return (
    <>
      <div>Global Error Component</div>
    </>
  );
}

export default GlobalErrorCmp;

