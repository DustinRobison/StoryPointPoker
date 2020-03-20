import { UserReducer } from "./reducers/UserReducer";

export const Reducer = (
  { user, help, ask, referAFriend, blogs, pilotRegister },
  action
) => {
  return {
    user: UserReducer(user, action)
  };
};
