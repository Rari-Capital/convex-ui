import { useRari } from "../context/RariContext";

export const useAuthedCallback = (callback: any, args: any[] | undefined) => {
  const { login, isAuthed } = useRari();

  const authedCallback = () => {
    if (isAuthed) {
      return args ? callback(...args) : callback();
    } else {
      return login();
    }
  };

  return authedCallback;
};
