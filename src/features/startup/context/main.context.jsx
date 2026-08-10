import { createContext, useState } from "react";

export const UserDataShowContext = createContext();

export function UserDataShowProvider({ children }) {
  const [allUserProjects, setAllUserProjects] = useState(); // ✅ default to empty array
  const [singleUser, setSingleUser] = useState()


  return (
    <UserDataShowContext.Provider
      value={{ allUserProjects, setAllUserProjects ,singleUser, setSingleUser}}
    >
      {children}
    </UserDataShowContext.Provider>
  );
}
