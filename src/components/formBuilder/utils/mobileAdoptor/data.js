import { compose, withProps, withHandlers } from "recompose";
import isMobile from "./helper";

const mobile = {
  is: isMobile(),
  className: "isMobile",
  style: {
    table: {
      width: "100%",
      paddingTop: "3vh"
    },
  }
};

export default function (component) {
  return compose(
    withProps(preProps => {
      return {
        mobile
      };
    }),
    withHandlers({
      mountClassNameOnRoot: () => className => {
        document.querySelector("body").classList.add(className);
      }
    })
  )(component);
}
