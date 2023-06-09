import { H } from "@/components/uiLib";
import {ReactNode} from "react";

const NotFound = ({children}:{children?:ReactNode}) => {
  return (
    <div>
      <H.H1>Page not found</H.H1>
      {children}
    </div>
  );
};

export default NotFound;
