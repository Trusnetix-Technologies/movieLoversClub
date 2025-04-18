import { useEffect } from "react";
import { useRouter } from "next/router";

// ==== IMPORT COMPONENTS ====
import Onboard from "@/components/Authentication/Onboard";

// ==== IMPORT REDUX ====
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, selectAuthData } from "@/redux/reducers/authReducer";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthData);

  useEffect(() => {
    if (auth.loading != "loaded") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (auth.loading == "loaded") {
      if (auth.authData.role == "ADMIN") {
        if (auth.authData.isOnboarded == true) {
          router.push("/admin");
        }
      } else {
        if (auth.authData.isOnboarded == true) {
          router.push("/");
        }
      }
    }
  }, [auth.loading]);

  return <Onboard />;
}
