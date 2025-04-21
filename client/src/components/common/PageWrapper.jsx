import { useEffect } from "react";
import { useRouter } from "next/router";

// ==== IMPORT COMPONENTS ====
import Header from "@/components/common/AppBar";

// ==== IMPORT REDUX ====
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, selectAuthData } from "@/redux/reducers/authReducer";

const PageWrapper = ({ children, title, description, selectedMenuItem }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(selectAuthData);

  useEffect(() => {
    if (auth.loading != "loaded") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  console.log(auth);

  useEffect(() => {
    if (auth.loading == "loaded") {
      if (auth.error == "error") {
        router.push("/login");
      }
      if (auth.authData.isOnboarded == false) {
        router.push("/onboard");
      }
    } else if (auth.loading == "error") {
      router.push("/login");
    }
  }, [auth.loading]);

  return (
    <div>
      <Header selectedMenuItem={selectedMenuItem}>{children}</Header>
    </div>
  );
};

export default PageWrapper;
