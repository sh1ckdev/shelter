// components/PublicRoute.js
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { store } from "../stores/store";

const PublicRoute = observer(({ children }) => {
  if (store.isAuth) {
    return <Navigate to="/profile" replace />; 
  }
  if (store.isModerator) {
    return <Navigate to="/moderator" replace />;
  }

  return children; 
});

export default PublicRoute;