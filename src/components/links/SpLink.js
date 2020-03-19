import React from "react";
import { Link as RouterLink } from "react-router-dom";

export const HomeLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} to="/" {...props} />
));
